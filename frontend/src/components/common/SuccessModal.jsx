import React from 'react';

const SuccessModal = ({ isOpen, onClose }) => {
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
                padding: '40px',
                width: '450px',
                maxWidth: '90%',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
            }}>
                {/* Ícono de éxito */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'scaleIn 0.3s ease-out'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                {/* Mensaje */}
                <h2 style={{
                    fontSize: '1.8rem',
                    marginBottom: '15px',
                    color: '#4CAF50',
                    fontWeight: 'bold'
                }}>
                    ¡Voto realizado con éxito!
                </h2>

                <p style={{
                    color: '#666',
                    marginBottom: '30px',
                    fontSize: '1rem'
                }}>
                    Tu voto ha sido registrado correctamente.
                </p>

                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '12px 40px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#45a049';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#4CAF50';
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    Aceptar
                </button>
            </div>

            <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default SuccessModal;
