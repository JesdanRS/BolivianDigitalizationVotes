import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, candidato, loading = false }) => {
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
              width: '100%',
              padding: '20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              {/* Partido */}
              <h2 style={{
                fontSize: '1.5rem',
                marginBottom: '15px',
                color: '#000000',
                fontWeight: 'bold'
              }}>
                {candidato.partido}
              </h2>

              {/* Presidente */}
              <div style={{ marginBottom: '10px', width: '100%' }}>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginBottom: '3px',
                  fontWeight: '600'
                }}>
                  Presidente:
                </p>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#000',
                  fontWeight: '500'
                }}>
                  {candidato.nombreCompletoPresidente}
                </p>
              </div>

              {/* Vicepresidente */}
              <div style={{ marginBottom: '15px', width: '100%' }}>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginBottom: '3px',
                  fontWeight: '600'
                }}>
                  Vicepresidente:
                </p>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#000',
                  fontWeight: '500'
                }}>
                  {candidato.nombreCompletoVicepresidente}
                </p>
              </div>

              {/* Descripción */}
              {candidato.descripcion && (
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  marginTop: '10px',
                  lineHeight: '1.4'
                }}>
                  {candidato.descripcion}
                </p>
              )}
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
            disabled={loading}
            style={{
              backgroundColor: loading ? '#bdbdbd' : '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '45%',
              opacity: loading ? 0.6 : 1,
              fontWeight: '600'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ef9a9a' : '#e53e3e',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '45%',
              opacity: loading ? 0.8 : 1,
              fontWeight: '600'
            }}
          >
            {loading ? 'Enviando...' : 'Confirmar Voto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;