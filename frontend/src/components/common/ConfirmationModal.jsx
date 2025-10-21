import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, candidato }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        width: '500px',
        maxWidth: '90%',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          color: '#000000',
          fontSize: '1.5rem'
        }}>
          ¿Estás seguro de tu elección?
        </h2>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px' 
        }}>
          {candidato && (
            <div style={{
              backgroundColor: '#e8f5e9',
              borderRadius: '12px',
              width: '250px',
              padding: '20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{ width: '150px', height: '150px', overflow: 'hidden', marginBottom: '20px' }}>
                <img
                  src={candidato.imagen}
                  alt={candidato.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#000000' }}>{candidato.nombre}</h2>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>{candidato.descripcion}</p>
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '20px'
        }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '45%',
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            style={{
              backgroundColor: '#e53e3e',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '45%',
            }}
          >
            Confirmar Voto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;