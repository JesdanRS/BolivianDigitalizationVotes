import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
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
      <Link to="#" style={{ 
          color: location.pathname === '#' ? '#dc2626' : '#666', 
          textDecoration: 'none',
          fontWeight: location.pathname === '#' ? 'bold' : 'normal'
        }}>
          Informacion
        </Link>
        <Link to="/votacion" style={{ 
          color: location.pathname === '/votacion' ? '#dc2626' : '#666', 
          textDecoration: 'none',
          fontWeight: location.pathname === '/votacion' ? 'bold' : 'normal'
        }}>
          Candidatos
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
        <Link to="/login" style={{ 
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Iniciar Sesión
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;