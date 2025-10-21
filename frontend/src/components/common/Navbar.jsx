import React from 'react';

const Navbar = () => {
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
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Información</a>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Candidatos</a>
        <a href="/resultados" style={{ color: '#666', textDecoration: 'none' }}>Resultados</a>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Ayuda</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '30px' }}>
        <span>ES</span>
        <a href="/login" style={{ 
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Iniciar Sesión
        </a>
      </div>
    </nav>
  );
};

export default Navbar;