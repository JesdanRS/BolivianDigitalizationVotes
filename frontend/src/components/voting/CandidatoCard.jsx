// src/components/voting/CandidatoCard.jsx

import React from 'react';

const CandidatoCard = ({ partido, nombrePresidente, nombreVicepresidente, descripcion, onVotar }) => {
  return (
    <div
      style={{
        backgroundColor: '#e8f5e9',
        borderRadius: '12px',
        width: '280px',
        padding: '25px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Partido (título principal) */}
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: '#000000',
        fontWeight: 'bold'
      }}>
        {partido}
      </h2>

      {/* Presidente */}
      <div style={{ marginBottom: '10px' }}>
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          marginBottom: '3px',
          fontWeight: '600'
        }}>
          Presidente:
        </p>
        <p style={{
          fontSize: '1rem',
          color: '#000',
          fontWeight: '500'
        }}>
          {nombrePresidente}
        </p>
      </div>

      {/* Vicepresidente */}
      <div style={{ marginBottom: '15px' }}>
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          marginBottom: '3px',
          fontWeight: '600'
        }}>
          Vicepresidente:
        </p>
        <p style={{
          fontSize: '1rem',
          color: '#000',
          fontWeight: '500'
        }}>
          {nombreVicepresidente}
        </p>
      </div>

      {/* Descripción */}
      <p style={{
        color: '#666',
        marginBottom: '20px',
        fontSize: '0.9rem',
        lineHeight: '1.4'
      }}>
        {descripcion}
      </p>

      {/* Botón de votar */}
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
          fontWeight: '600'
        }}
      >
        Votar →
      </button>
    </div>
  );
};

export default CandidatoCard;