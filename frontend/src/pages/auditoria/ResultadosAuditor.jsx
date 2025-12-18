import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import AuditNavbar from '../../components/common/AuditNavbar';

const ResultadosAuditor = () => {
  const { keycloak, initialized } = useKeycloak();

  const [resultadosPartidos, setResultadosPartidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  // Colores predefinidos para los partidos
  const coloresPartidos = [
    '#2563eb', // Azul
    '#dc2626', // Rojo
    '#059669', // Verde
    '#d97706', // Naranja
    '#7c3aed', // Morado
    '#0891b2', // Cyan
    '#db2777', // Rosa
    '#65a30d', // Lima
  ];

  // Función para cargar datos desde la API
  const cargarDatos = async () => {
    if (!initialized || !keycloak?.token) {
      console.warn('No hay token todavía');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Cargar resultados por partido
      const partidosResponse = await fetch('http://localhost:8080/api/resultados/partidos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
      });

      if (!partidosResponse.ok) {
        throw new Error(`Error HTTP: ${partidosResponse.status}`);
      }

      const partidosData = await partidosResponse.json();
      console.log('Resultados por partido (Auditor):', partidosData);
      setResultadosPartidos(partidosData);

      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (initialized && keycloak?.token) {
      cargarDatos();
    }
  }, [initialized, keycloak?.token]);

  // Auto-actualización cada 15 segundos
  useEffect(() => {
    if (!initialized || !keycloak?.token) return;

    const interval = setInterval(() => {
      cargarDatos();
    }, 15 * 1000); // 15 segundos

    return () => clearInterval(interval);
  }, [initialized, keycloak?.token]);

  // Calcular total de votos
  const totalVotos = resultadosPartidos.reduce((sum, p) => sum + p.conteoVotos, 0);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: '#f9fafb',
      minHeight: '100dvh',
      color: '#111'
    }}>
      <AuditNavbar />

      <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header con última actualización */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              margin: 0,
              marginBottom: '8px'
            }}>
              📊 Resultados Electorales en Tiempo Real
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>
              Panel de Auditoría - Actualización automática cada 15 segundos
            </p>
          </div>

          <div style={{
            textAlign: 'right',
            backgroundColor: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
              Última actualización
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111' }}>
              {ultimaActualizacion.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #ef4444',
            color: '#991b1b',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: 500
          }}>
            ⚠️ Error: {error}
          </div>
        )}

        {/* Indicador de carga */}
        {cargando && resultadosPartidos.length === 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '80px',
            color: '#666'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #2563eb',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p>Cargando resultados en tiempo real...</p>
            </div>
          </div>
        )}

        {/* Resumen de votos totales */}
        {!cargando && totalVotos > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '24px 32px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '8px' }}>
              Total de Votos Emitidos
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>
              {totalVotos.toLocaleString()}
            </div>
          </div>
        )}

        {/* Resultados por partido */}
        {resultadosPartidos.length === 0 && !cargando ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <h3 style={{ color: '#374151', marginBottom: '8px' }}>
              No hay votos registrados aún
            </h3>
            <p style={{ color: '#6b7280' }}>
              Los resultados aparecerán aquí cuando se emitan los primeros votos.
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '20px',
              color: '#111'
            }}>
              Resultados por Partido Político
            </h2>

            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {resultadosPartidos.map((partido, index) => {
                const porcentaje = totalVotos > 0
                  ? ((partido.conteoVotos / totalVotos) * 100).toFixed(2)
                  : 0;
                const color = coloresPartidos[index % coloresPartidos.length];

                return (
                  <div
                    key={partido.id}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <h3 style={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        margin: 0,
                        color: '#111'
                      }}>
                        {partido.partido}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '2px' }}>
                            Votos
                          </div>
                          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: color }}>
                            {partido.conteoVotos.toLocaleString()}
                          </div>
                        </div>
                        <div style={{
                          backgroundColor: color,
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          fontSize: '1.6rem',
                          fontWeight: 800,
                          minWidth: '100px',
                          textAlign: 'center'
                        }}>
                          {porcentaje}%
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${porcentaje}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                        transition: 'width 0.8s ease-in-out',
                        borderRadius: '8px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer informativo */}
        {resultadosPartidos.length > 0 && (
          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>
              🔄 Los resultados se actualizan automáticamente cada 15 segundos para monitoreo en tiempo real.
            </p>
          </div>
        )}
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResultadosAuditor;
