import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';

const MiVoto = () => {
  // Datos del votante (en producción vendrían del backend)
  const [votanteData, setVotanteData] = useState({
    nombreCompleto: 'Sofía Ramírez',
    cedulaIdentidad: '123456789',
    lugarVotacion: 'Colegio Nacional Sucre',
    mesaSufragio: '123',
    fechaEmision: '23/10/2024',
  });

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#fff',
      color: '#000',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div style={{
        padding: '40px',
        margin: '0',
        textAlign: 'center',
        width: '100%',
        flex: '1',
        overflow: 'auto',
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '10px',
          fontWeight: 'bold' 
        }}>
          Carnet de Sufragio Digital
        </h1>
        <p style={{ 
          color: '#666666', 
          marginBottom: '25px',
          fontSize: '1rem'
        }}>
          Este es tu comprobante de votación. Guárdalo en un lugar seguro.
        </p>

        {/* Carnet de Sufragio Digital */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#222',
            borderRadius: '8px',
            padding: '15px',
            width: '100%',
            maxWidth: '750px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex'
          }}>
            {/* Izquierda - Imagen de ID */}
            <div style={{
              flex: '0 0 40%',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              borderRadius: '5px',
              marginRight: '15px'
            }}>
              <div style={{
                backgroundColor: '#f0d9b5',
                padding: '10px',
                borderRadius: '5px',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  {/* Foto */}
                  <div style={{
                    width: '80px',
                    height: '90px',
                    backgroundColor: '#fff',
                    borderRadius: '3px',
                    marginRight: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      FOTO
                    </div>
                  </div>
                  
                  {/* Escudo */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <img 
                      src="/src/assets/images/example.png" 
                      alt="Escudo Bolivia"
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'contain'
                      }}
                    />
                    <div style={{
                      fontSize: '7px',
                      color: '#333',
                      textAlign: 'center',
                      marginTop: '3px',
                      lineHeight: '1.2'
                    }}>
                      <strong>REPÚBLICA DE BOLIVIA</strong><br/>
                      ÓRGANO ELECTORAL<br/>
                      PLURINACIONAL
                    </div>
                  </div>
                </div>
                
                {/* Bandera */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div style={{ 
                    width: '18px', 
                    height: '12px', 
                    backgroundColor: '#D52B1E', 
                    marginRight: '2px' 
                  }}></div>
                  <div style={{ 
                    width: '18px', 
                    height: '12px', 
                    backgroundColor: '#F9E300', 
                    marginRight: '2px' 
                  }}></div>
                  <div style={{ 
                    width: '18px', 
                    height: '12px', 
                    backgroundColor: '#007934' 
                  }}></div>
                  <div style={{
                    fontSize: '6px',
                    marginLeft: '5px',
                    color: '#333',
                    lineHeight: '1.2'
                  }}>
                    CÉDULA DE IDENTIDAD<br/>
                    PAPELETA DE SUFRAGIO
                  </div>
                </div>
                
                {/* Texto en pequeño */}
                <div style={{
                  fontSize: '5px',
                  color: '#333',
                  lineHeight: '1.2',
                  marginBottom: '10px'
                }}>
                  ESTE DOCUMENTO ACREDITA LA IDENTIDAD DEL CIUDADANO Y SU<br/>
                  DERECHO A PARTICIPAR EN LOS PROCESOS ELECTORALES<br/>
                  DE ACUERDO A LEY.
                </div>
                
                {/* Código de barras simulado */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  width: '90%',
                  textAlign: 'center',
                  fontSize: '8px',
                  letterSpacing: '1px',
                }}>
                  <div style={{
                    borderBottom: '1px solid #333',
                    paddingBottom: '3px',
                    marginBottom: '3px'
                  }}>
                    C0 0342C0 250 9C7 63 22.52 040573 518
                  </div>
                </div>
              </div>
            </div>
            
            {/* Derecha - Información del votante */}
            <div style={{
              flex: '1',
              backgroundColor: '#fff',
              borderRadius: '5px',
              padding: '20px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                República de Bolivia
              </h2>
              
              <p style={{
                fontSize: '0.8rem',
                color: '#666',
                marginBottom: '20px'
              }}>
                Órgano Electoral Plurinacional
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <div style={{width: '50%'}}>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#888',
                    marginBottom: '3px'
                  }}>
                    Nombre Completo
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {votanteData.nombreCompleto}
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#888',
                    marginBottom: '3px'
                  }}>
                    Cédula de Identidad
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {votanteData.cedulaIdentidad}
                  </p>
                </div>
              </div>
              
              <div style={{
                marginBottom: '10px'
              }}>
                <p style={{
                  fontSize: '0.7rem',
                  color: '#888',
                  marginBottom: '3px'
                }}>
                  Lugar de Votación
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {votanteData.lugarVotacion}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                marginTop: 'auto'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#888',
                    marginBottom: '3px'
                  }}>
                    Mesa de Sufragio
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {votanteData.mesaSufragio}
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#888',
                    marginBottom: '3px'
                  }}>
                    Fecha de Emisión
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {votanteData.fechaEmision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botón de descarga */}
        <button style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <span style={{
            marginRight: '8px',
            fontSize: '18px',
            lineHeight: '1'
          }}>⬇</span>
          Descargar Carnet
        </button>
      </div>
    </div>
  );
};

export default MiVoto;
