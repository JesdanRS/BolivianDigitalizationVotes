// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmailVerificationModal from '../components/common/EmailVerificationModal';
import { saveUserData } from '../services/authService';
import {
  login as loginApi,
  solicitarCodigo as solicitarCodigoApi,
  verificarCodigo as verificarCodigoApi,
} from '../services/userService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [carnet, setCarnet] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithKeycloak } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!carnet || !fechaNacimiento || !email) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      // 1) Token técnico USER en Keycloak
      await loginWithKeycloak('USER');

      // 2) Formatear fecha DD/MM/AAAA -> AAAA-MM-DD
      const [dia, mes, anio] = fechaNacimiento.split('/');
      const fechaIso = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

      // 3) Login backend
      const loginResponse = await loginApi({
        carnet,
        fechaNacimiento: fechaIso,
      });

      // 4) Validar correo que viene del backend
      const correoBackend =
        (loginResponse &&
          (loginResponse.correoElectronico ||
            loginResponse.email ||
            loginResponse.correo)) ||
        '';

      if (!correoBackend) {
        setError('No se pudo obtener el correo registrado del usuario.');
        return;
      }

      if (correoBackend.trim().toLowerCase() !== email.trim().toLowerCase()) {
        setError('El correo electrónico no coincide con el registrado en el sistema.');
        return;
      }

      // 5) Guardar usuario en front
      saveUserData(loginResponse);
      login(loginResponse);

      // 6) Pedir código al backend
      await solicitarCodigoApi(carnet);

      // 7) Abrir modal para introducir el código
      setIsVerificationModalOpen(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleVerifyCode = async (code) => {
    try {
      await verificarCodigoApi(carnet, code);

      console.log('Código verificado correctamente');
      setIsVerificationModalOpen(false);

      // Redirección: primero vía router…
      navigate('/votacion', { replace: true });
      // …y además forzamos navegación dura para que NO haya duda
      window.location.href = '/votacion';
    } catch (err) {
      console.error(err);
      alert(err.message || 'Código incorrecto o expirado. Por favor intente nuevamente.');
    }
  };

  const handleResendCode = async () => {
    if (!carnet) {
      alert('No se ha proporcionado un carnet válido');
      return;
    }

    try {
      await solicitarCodigoApi(carnet);
      alert('Se ha generado y enviado un nuevo código de verificación');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al solicitar un nuevo código de verificación');
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#fff',
        color: '#000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          padding: '40px',
          margin: '0',
          textAlign: 'center',
          width: '100%',
          flex: '1',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '450px',
            width: '100%',
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Iniciar Sesión</h1>
          <p style={{ color: '#666666', marginBottom: '25px' }}>
            Accede para ejercer tu derecho al voto.
          </p>

          <form
            onSubmit={handleLogin}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <input
              type="text"
              placeholder="Carnet de Identidad"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
              }}
            />

            <input
              type="text"
              placeholder="Fecha de Nacimiento (DD/MM/AAAA)"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
              }}
            />

            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '5px',
              }}
            >
              {error && (
                <p style={{ color: 'red', fontSize: '14px', marginBottom: 0 }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Iniciar Sesión
            </button>
          </form>

          <p
            style={{
              marginTop: '20px',
              fontSize: '14px',
              color: '#666666',
            }}
          >
            ¿Eres administrador o jurado?{' '}
            <Link to="/admin-login" style={{ color: '#dc2626', textDecoration: 'none' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        email={email}
      />
    </div>
  );
};

export default Login;