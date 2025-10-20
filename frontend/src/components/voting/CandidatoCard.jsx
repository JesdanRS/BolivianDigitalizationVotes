// src/components/voting/CandidatoCard.jsx

import React from 'react';

const CandidatoCard = ({ nombre, descripcion, imagen, onVotar }) => {
  return (
    <div
      style={{
        backgroundColor: '#e8f5e9',
        borderRadius: '12px',
        width: '250px',
        padding: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ width: '150px', height: '150px', overflow: 'hidden', marginBottom: '20px' }}>
        <img
          src={imagen}
          alt={nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#000000' }}>{nombre}</h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>{descripcion}</p>
      <button
        onClick={onVotar}
        style={{
          backgroundColor: '#e53e3e',
          color: '#fff',
          border: 'none',
          borderRadius: '9999px',
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Votar →
      </button>
    </div>
  );
};

export default CandidatoCard;