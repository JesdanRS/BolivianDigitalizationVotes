// src/components/voting/CandidatoCard.jsx
import React from 'react';

const CandidatoCard = ({
  nombre,
  descripcion,
  imagen,
  accentColor = '#ecfdf3',
  isBlank = false,
  personColor = '#4b5563',
  onVotar,
}) => {
  return (
    <div
      style={{
        backgroundColor: accentColor,
        borderRadius: '16px',
        padding: '20px',
        width: '240px',
        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      {/* Icono de persona */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '999px',
          backgroundColor: personColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 24,
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          👤
        </span>
      </div>

      {/* Imagen (opcional) */}
      {imagen && (
        <img
          src={imagen}
          alt={nombre}
          style={{
            width: 96,
            height: 96,
            objectFit: 'cover',
            borderRadius: '999px',
            marginBottom: 12,
            border: '3px solid rgba(148, 163, 184, 0.4)',
          }}
        />
      )}

      {/* Nombre candidato */}
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          marginBottom: 4,
          color: '#111827',
        }}
      >
        {nombre}
      </h2>

      {/* Partido / descripción */}
      <p
        style={{
          fontSize: '0.8rem',
          color: '#4b5563',
          marginBottom: 20,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {descripcion}
      </p>

      {/* Botón votar */}
      <button
        type="button"
        onClick={onVotar}
        style={{
          marginTop: 'auto',
          width: '100%',
          padding: '10px 0',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.9rem',
          backgroundColor: isBlank ? '#0f172a' : '#dc2626',
          color: '#ffffff',
        }}
      >
        {isBlank ? 'Votar en blanco' : 'Votar →'}
      </button>
    </div>
  );
};

export default CandidatoCard;