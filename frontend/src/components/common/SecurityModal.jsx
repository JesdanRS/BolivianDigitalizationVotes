import React from 'react';

const SecurityModal = ({ isOpen, cameraActive, multipleFacesDetected, onRetry }) => {
  if (!isOpen) return null;

  const title = multipleFacesDetected
    ? 'Se detectó más de una persona'
    : 'Cámara requerida para continuar';

  const message = multipleFacesDetected
    ? 'Por seguridad, la votación está bloqueada. Por favor, asegúrate de estar solo frente a la cámara.'
    : 'No se pudo activar la cámara o no se otorgaron permisos. Activa la cámara para continuar con la votación.';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '520px',
        maxWidth: '90%',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '12px', color: '#000', fontSize: '1.5rem' }}>{title}</h2>
        <p style={{ textAlign: 'center', color: '#333', marginBottom: '16px' }}>{message}</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '9999px',
            backgroundColor: cameraActive ? '#e8f5e9' : '#fdecec',
            color: cameraActive ? '#2f855a' : '#c53030',
            fontSize: '0.9rem'
          }}>
            Cámara: {cameraActive ? 'Activa' : 'Inactiva'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={onRetry}
            style={{
              backgroundColor: '#3182ce',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Reintentar detección
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;