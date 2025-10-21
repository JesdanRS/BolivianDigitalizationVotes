import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmailVerificationModal from '../components/common/EmailVerificationModal';
import { authenticateUser, saveUserData } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { logEvent } from '../services/auditoriaService';

const Login = () => {
  const navigate = useNavigate();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [carnet, setCarnet] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validar que los campos no estén vacíos
    if (!carnet || !fechaNacimiento) {
      setError('Por favor complete todos los campos');
      // RF06: intento con campos incompletos
      logEvent({
        tipo: 'LOGIN',
        modulo: 'usuarios',
        severidad: 'WARN',
        usuario: carnet || 'desconocido',
        detalle: 'Intento de inicio sin completar campos.'
      });
      return;
    }
    
    // Autenticar usuario con los datos predefinidos
    const result = authenticateUser(carnet, fechaNacimiento);
    
    if (result.success) {
      // Guardar datos del usuario y actualizar contexto
      saveUserData(result.user);
      login(result.user);

      // RF06: login exitoso (primer factor)
      logEvent({
        tipo: 'LOGIN',
        modulo: 'usuarios',
        severidad: 'INFO',
        usuario: result.user?.username || carnet,
        detalle: 'Inicio de sesión satisfactorio (1er factor)'
      });
      
      // Abrir modal de verificación (solo simulación)
      setIsVerificationModalOpen(true);
    } else {
      setError('Credenciales inválidas');
      // RF06: login fallido
      logEvent({
        tipo: 'LOGIN',
        modulo: 'usuarios',
        severidad: 'WARN',
        usuario: carnet,
        detalle: 'Credenciales inválidas'
      });
    }
  };
  
  const handleVerifyCode = (code) => {
    console.log('Código verificado:', code);
    // Cerrar modal 2FA simulado
    setIsVerificationModalOpen(false);

    // RF06: segundo factor verificado
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    logEvent({
      tipo: 'LOGIN',
      modulo: 'usuarios',
      severidad: 'INFO',
      usuario: userData?.username || carnet || 'votante',
      detalle: 'Segundo factor verificado'
    });

    // Redirigir al usuario a la página de votación
    navigate('/votacion');
  };
  
  const handleResendCode = () => {
    console.log('Reenviar código');
    // Aquí se solicitaría al backend un nuevo envío del código
  };
  
  return (
    <div style={{
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
      bottom: 0
    }}>
      
      {/* Contenido principal */}
      <div style={{
        padding: '40px',
        margin: '0',
        textAlign: 'center',
        width: '100%',
        flex: '1',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '450px',
          width: '100%',
          padding: '30px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
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
            }}>
            <input
              type="text"
              placeholder="Carnet de Identidad"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '16px'
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
                fontSize: '16px'
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
                fontSize: '16px'
              }}
            />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '5px'
            }}>
              {error && (
                <p style={{ color: 'red', fontSize: '14px', marginBottom: 0 }}>
                  {error}
                </p>
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
                marginTop: '10px'
              }}
            >
              Iniciar Sesión
            </button>
          </form>
          
          <p style={{ 
            marginTop: '20px',
            fontSize: '14px',
            color: '#666666'
          }}>
            ¿Eres administrador o jurado? <Link to="/admin-login" style={{ color: '#dc2626', textDecoration: 'none' }}>Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
      {/* Modal de verificación de correo */}
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
