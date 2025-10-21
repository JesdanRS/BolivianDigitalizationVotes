import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmailVerificationModal from '../components/common/EmailVerificationModal';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulamos el envío del formulario y abrimos el modal de verificación
    setIsVerificationModalOpen(true);
  };
  
  const handleVerifyCode = (code) => {
    console.log('Código verificado:', code);
    // Aquí se enviaría el código al backend para su verificación
    setIsVerificationModalOpen(false);
    // Redirigir al usuario a la página de auditoria después de verificar el código (administrador)
    navigate('/auditoria');
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
            }}>
            <input
              type="text"
              placeholder="Carnet de Identidad"
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

            <input
              type="password"
              placeholder="Contraseña"
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '16px'
              }}
            />
            
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
            ¿No eres administrador? <Link to="/login" style={{ color: '#dc2626', textDecoration: 'none' }}>Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
      {/* Modal de verificación de correo */}
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
