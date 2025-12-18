import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/auditoria/StatCard';

const Resultados = () => {
  const { keycloak, initialized } = useKeycloak();

  const [resultadosPartidos, setResultadosPartidos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
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
      console.log('Resultados por partido:', partidosData);
      setResultadosPartidos(partidosData);

      // Cargar estadísticas generales
      const statsResponse = await fetch('http://localhost:8080/api/resultados/resultados/estadisticas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData && statsData.length > 0) {
          setEstadisticas(statsData[0]);
        }
      }

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
        overflow: 'auto'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Resultados Electorales en Tiempo Real</h1>
        <p style={{ color: '#000000', marginBottom: '20px' }}>
          Resultados oficiales de las elecciones presidenciales en Bolivia.
        </p>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            maxWidth: '800px',
            margin: '0 auto 20px'
          }}>
            {error}
            <button 
              onClick={cargarDatos} 
              style={{ 
                marginLeft: '10px', 
                padding: '6px 12px', 
                cursor: 'pointer',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Indicador de carga */}
        {cargando && resultadosPartidos.length === 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Mostrar datos */}
        {!cargando && !error && (
          <>
            {/* Estadísticas Generales */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              padding: '0',
              width: '100%',
              marginBottom: '40px'
            }}>
              <StatCard label="Total de Votos" value={totalVotos.toLocaleString()} />
              <StatCard 
                label="Partidos Participantes" 
                value={resultadosPartidos.length.toString()} 
              />
              {estadisticas && (
                <>
                  <StatCard label="Votos Nulos" value={estadisticas.votosNulos.toLocaleString()} />
                  <StatCard label="Participación" value={`${estadisticas.participacionPorcentaje.toFixed(1)}%`} />
                </>
              )}
            </div>

            {/* Resultados por Partido - Gráficas de Barras */}
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              backgroundColor: '#f9fafb',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', color: '#1f2937' }}>
                Resultados por Partido Político
              </h2>

              {resultadosPartidos.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  No hay votos registrados aún. Los resultados aparecerán aquí en tiempo real.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {resultadosPartidos.map((partido, index) => {
                    const color = coloresPartidos[index % coloresPartidos.length];
                    const porcentaje = partido.porcentaje || 0;

                    return (
                      <div 
                        key={partido.partido}
                        style={{
                          backgroundColor: 'white',
                          padding: '20px',
                          borderRadius: '8px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {/* Encabezado del partido */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <h3 style={{ 
                            fontSize: '1.3rem', 
                            margin: 0,
                            color: '#1f2937',
                            fontWeight: 'bold'
                          }}>
                            {partido.partido}
                          </h3>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              fontSize: '1.5rem', 
                              fontWeight: 'bold',
                              color: color
                            }}>
                              {porcentaje.toFixed(2)}%
                            </div>
                            <div style={{ 
                              fontSize: '0.9rem',
                              color: '#6b7280'
                            }}>
                              {partido.conteoVotos.toLocaleString()} votos
                            </div>
                          </div>
                        </div>

                        {/* Barra de progreso */}
                        <div style={{
                          width: '100%',
                          height: '30px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '15px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <div style={{
                            width: `${porcentaje}%`,
                            height: '100%',
                            backgroundColor: color,
                            transition: 'width 0.5s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '10px',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>
                            {porcentaje > 10 && `${porcentaje.toFixed(1)}%`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div style={{
              marginTop: '40px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', margin: 0 }}>
                Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
              <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9rem' }}>
                Los resultados se actualizan automáticamente cada 15 segundos
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Resultados;
