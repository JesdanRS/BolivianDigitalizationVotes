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
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>VotoSeguro</div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Información</a>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Candidatos</a>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Resultados</a>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Ayuda</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '30px' }}>
        <span>ES</span>
        <div style={{ 
          width: '30px', 
          height: '30px', 
          backgroundColor: '#ccc', 
          borderRadius: '50%', 
          overflow: 'hidden',
          marginLeft: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Placeholder para imagen de perfil */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;