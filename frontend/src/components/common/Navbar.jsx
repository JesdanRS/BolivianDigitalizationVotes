import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  
  const handleLogout = () => {
    logout();
    authLogout();
    navigate('/login');
  };
  
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #e0e0e0',
      width: '100%'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', display: 'flex', alignItems: 'center' }}>
        <img 
          src="/src/assets/images/example.png" 
          alt="Elecciones Bolivia" 
          style={{ height: '24px', marginRight: '8px' }}
        />
        Elecciones Bolivia
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/votacion" style={{ 
          color: location.pathname === '/votacion' ? '#dc2626' : '#666', 
          textDecoration: 'none',
          fontWeight: location.pathname === '/votacion' ? 'bold' : 'normal'
        }}>
          Candidatos
        </Link>
        <Link to="/mi-voto" style={{ 
          color: location.pathname === '/mi-voto' ? '#dc2626' : '#666', 
          textDecoration: 'none',
          fontWeight: location.pathname === '/mi-voto' ? 'bold' : 'normal'
        }}>
          Mi Voto
        </Link>
        <Link to="/resultados" style={{ 
          color: location.pathname === '/resultados' ? '#dc2626' : '#666', 
          textDecoration: 'none',
          fontWeight: location.pathname === '/resultados' ? 'bold' : 'normal'
        }}>
          Resultados
        </Link>
        <Link to="/ayuda" style={{ 
          color: location.pathname === '/ayuda' ? '#dc2626' : '#666', 
          textDecoration: 'none',
          fontWeight: location.pathname === '/ayuda' ? 'bold' : 'normal'
        }}>
          Ayuda
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '30px' }}>
        <span>ES</span>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '4px',
            border: 'none',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;