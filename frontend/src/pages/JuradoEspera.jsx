import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

const JuradoEspera = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    logout();
    authLogout();
    navigate('/login');
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
      backgroundColor: '#f9fafb',
      color: '#111',
    }}>
      {/* Barra de navegación */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{fontSize: '1.4rem', fontWeight: 800, color: '#111'}}>VotoSeguro</div>
          <div style={{fontSize: 12, color: '#6b7280', marginTop: 2}}>· Jurado Electoral</div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{fontSize: 12, color: '#6b7280'}}>Jurado</span>
          <div style={{width: 32, height: 32, borderRadius: '50%', background: '#c7d2fe'}} />
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              border: 'none',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              marginLeft: '10px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        flex: 1
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            fontSize: '36px',
            color: '#dc2626'
          }}>
            🛠️
          </div>
          
          <h1 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '16px'}}>
            Módulo en Desarrollo
          </h1>
          
          <p style={{color: '#6b7280', fontSize: '1.1rem', marginBottom: '24px'}}>
            El sistema para Jurados Electorales se encuentra en desarrollo. Pronto tendrás acceso a todas las herramientas necesarias para gestionar el proceso electoral.
          </p>

          <p style={{color: '#4b5563', marginBottom: '16px'}}>
            Las funcionalidades que estarán disponibles próximamente incluyen:
          </p>

          <ul style={{
            textAlign: 'left',
            maxWidth: '400px',
            margin: '0 auto 32px auto',
            color: '#4b5563'
          }}>
            <li style={{marginBottom: '8px'}}>Registro de asistencia de votantes</li>
            <li style={{marginBottom: '8px'}}>Conteo y validación de votos</li>
            <li style={{marginBottom: '8px'}}>Generación de actas electorales</li>
            <li style={{marginBottom: '8px'}}>Reportes de incidencias</li>
            <li>Transmisión de resultados</li>
          </ul>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#b91c1c'}
            onMouseOut={(e) => e.target.style.background = '#dc2626'}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuradoEspera;
