// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmailVerificationModal from '../components/common/EmailVerificationModal';
import { saveUserData } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import {
  login as loginApi,
  solicitarCodigo as solicitarCodigoApi,
  verificarCodigo as verificarCodigoApi,
} from '../services/userService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [carnet, setCarnet] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithKeycloak } = useAuth();

  // Rol decidido SOLO por la contraseña
  const inferRoleFromPassword = (pwd) => {
    if (pwd === 'admin123') return 'admin';
    if (pwd === 'auditor123') return 'auditor';
    if (pwd === 'jurado123') return 'jurado';
    return null; // contraseña no válida
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!carnet || !fechaNacimiento || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }

    // 1) Determinar rol según contraseña
    const role = inferRoleFromPassword(password);
    if (!role) {
      setError('Contraseña inválida para administrador/jurado.');
      return;
    }

    try {
      // 2) Obtener token técnico de Keycloak con rol USER
      //    (para autorizar /api/usuarios/login y los endpoints de código)
      await loginWithKeycloak('USER');

      // 3) Autenticación contra backend de usuarios (CI + fecha)
      const [dia, mes, anio] = fechaNacimiento.split('/');
      const fechaIso = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

      const loginResponse = await loginApi({
        carnet,
        fechaNacimiento: fechaIso,
      });

      // 4) (Opcional) validar correo con lo que devuelve el backend
      const correoBackend = (
        loginResponse.correoElectronico ||
        loginResponse.email ||
        loginResponse.correo ||
        ''
      ).trim().toLowerCase();

      if (correoBackend && correoBackend !== email.trim().toLowerCase()) {
        setError('El correo electrónico no coincide con el registrado en el sistema.');
        return;
      }

      // 5) Construir usuario para el front, agregando rol manualmente
      const userForFrontend = {
        ...loginResponse, // DTO del backend (no tiene rol)
        role,             // 'admin' | 'auditor' | 'jurado' (solo front)
        email,
      };

      saveUserData(userForFrontend);
      login(userForFrontend);

      // 6) Pedir código al backend (usuarios-service)
      await solicitarCodigoApi(carnet); // POST /api/usuarios/{carnet}/solicitar-codigo

      // 7) Mostrar modal para introducir código
      setIsVerificationModalOpen(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleVerifyCode = async (code) => {
    try {
      // 8) Verificar código en backend
      await verificarCodigoApi(carnet, code); // POST /api/usuarios/{carnet}/verificar-codigo

      console.log('Código verificado correctamente');
      setIsVerificationModalOpen(false);

      // 9) Inferir de nuevo el rol desde la contraseña actual
      const role = inferRoleFromPassword(password);

      try {
        // 10) Pedir token técnico a Keycloak y redirigir según rol
        if (role === 'auditor') {
          await loginWithKeycloak('AUDITOR');
          await loginWithKeycloak('ADMIN');
          navigate('/auditoria');

        } else if (role === 'admin') {
          await loginWithKeycloak('ADMIN');
          navigate('/gestionar-candidatos');

        } else {
          // jurado
          await loginWithKeycloak('USER'); // o un rol específico si lo creas
          navigate('/jurado-espera');
        }
      } catch (e) {
        console.error('Error al obtener token de Keycloak', e);
        alert('Hubo un problema obteniendo el token de seguridad. Intente nuevamente.');
      }
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
      alert('Se ha enviado un nuevo código de verificación');
    } catch (error) {
      console.error(error);
      alert('Error al reenviar el código de verificación');
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
          <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Acceso Administrativo</h1>
          <p style={{ color: '#666666', marginBottom: '25px' }}>
            Ingresa tus credenciales de administrador o jurado.
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

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
              }}
            />

            {error && (
              <p style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>{error}</p>
            )}

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

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666666' }}>
            ¿No eres administrador?{' '}
            <Link to="/login" style={{ color: '#dc2626', textDecoration: 'none' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        email={email}
      />
    </div>
  );
};

export default AdminLogin;
