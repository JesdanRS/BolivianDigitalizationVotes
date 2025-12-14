import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/auditoria/StatCard';
import ResultadoBar from '../components/voting/ResultadoBar';
import { obtenerResultados, obtenerEstadisticas } from '../services/votacionService';

const Resultados = () => {
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [estadisticas, setEstadisticas] = useState({
    totalVotos: 0,
    votosValidos: 0,
    votosNulos: 0,
    participacion: 0,
    mesasEscrutadas: 0,
    mesasTotal: 1560
  });
  const [resultadosCandidatos, setResultadosCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar datos de la API
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar estadísticas y resultados en paralelo
      const [statsResponse, resultadosResponse] = await Promise.all([
        obtenerEstadisticas(),
        obtenerResultados()
      ]);

      // Actualizar estadísticas
      if (statsResponse.success) {
        setEstadisticas({
          totalVotos: statsResponse.data.totalVotos || 0,
          votosValidos: statsResponse.data.votosValidos || 0,
          votosNulos: statsResponse.data.votosNulos || 0,
          participacion: statsResponse.data.participacion || 0,
          mesasEscrutadas: statsResponse.data.mesasEscrutadas || 0,
          mesasTotal: statsResponse.data.mesasTotal || 1560
        });
      }

      // Actualizar resultados de candidatos
      if (resultadosResponse.success) {
        const candidatos = resultadosResponse.data.map((candidato, index) => {
          // Colores para cada candidato
          const colores = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];
          return {
            nombre: candidato.nombre,
            porcentaje: parseFloat(candidato.porcentaje) || 0,
            votos: candidato.votos || 0,
            color: colores[index % colores.length]
          };
        });
        setResultadosCandidatos(candidatos);
      }

      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los resultados. Intentando de nuevo...');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos inicialmente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Actualizar cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      cargarDatos();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Resultados Electorales</h1>
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
          </div>
        )}

        {/* Indicador de carga */}
        {loading && resultadosCandidatos.length === 0 && (
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

        {/* Sección de Estadísticas Generales */}
        {!loading || resultadosCandidatos.length > 0 ? (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              padding: '0',
              width: '100%',
              marginBottom: '40px'
            }}>
              <StatCard label="Total de Votos" value={estadisticas.totalVotos.toLocaleString()} />
              <StatCard label="Votos Válidos" value={estadisticas.votosValidos.toLocaleString()} />
              <StatCard label="Votos Nulos" value={estadisticas.votosNulos.toLocaleString()} />
              <StatCard label="Participación" value={`${estadisticas.participacion}%`} />
              <StatCard label="Mesas Escrutadas" value={`${estadisticas.mesasEscrutadas}/${estadisticas.mesasTotal}`} />
              <StatCard label="Progreso del Escrutinio" value={`${Math.round((estadisticas.mesasEscrutadas / estadisticas.mesasTotal) * 100)}%`} />
            </div>

            {/* Sección de Resultados por Candidato */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              padding: '0',
              width: '100%'
            }}>
              {resultadosCandidatos.map((candidato, index) => (
                <ResultadoBar
                  key={index}
                  nombre={candidato.nombre}
                  porcentaje={candidato.porcentaje}
                  votos={candidato.votos}
                  color={candidato.color}
                />
              ))}
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

              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Resultados;
