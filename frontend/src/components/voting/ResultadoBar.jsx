import React from 'react';

const ResultadoBar = ({ nombre, porcentaje, votos, color }) => {
  return (
    <div
      style={{
        backgroundColor: '#e8f5e9',
        borderRadius: '12px',
        width: '400px',
        padding: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#000000' }}>{nombre}</h2>

      <div style={{
        width: '100%',
        marginBottom: '15px'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: '5px'
        }}>
          {porcentaje}%
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: '#666',
          marginBottom: '15px'
        }}>
          {votos.toLocaleString()} votos
        </div>

        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${porcentaje}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '6px',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
      </div>
    </div>
  );
};

export default ResultadoBar;
