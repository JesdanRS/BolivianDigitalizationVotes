import React, { useState, useEffect } from 'react';
import AuditNavbar from '../../components/common/AuditNavbar';
import StatCard from '../../components/auditoria/StatCard';
import ResultadoBar from '../../components/voting/ResultadoBar';
import { obtenerResultados, obtenerEstadisticas } from '../../services/votacionService';

const ResultadosAuditor = () => {
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
  const [actualizando, setActualizando] = useState(false);

  // Función para cargar datos de la API
  const cargarDatos = async (esActualizacion = false) => {
    try {
      if (esActualizacion) {
        setActualizando(true);
      } else {
        setLoading(true);
      }
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
      setError('Error al cargar los resultados. Verificar conexión con el servidor.');
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  // Cargar datos inicialmente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Actualizar en tiempo real cada 30 segundos para auditores
  useEffect(() => {
    const interval = setInterval(() => {
      cargarDatos(true);
    }, 30 * 1000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f9fafb', minHeight: '100dvh', color: '#111' }}>
      <AuditNavbar />

      <div style={{ padding: '24px 40px', width: '95%', maxWidth: '100%', margin: 0 }}>
        {/* Header con indicador de actualización */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>Resultados Electorales - Auditor</h1>
          {actualizando && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#dbeafe',
              padding: '8px 16px',
              borderRadius: '8px',
              color: '#1e40af'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #60a5fa',
                borderTop: '2px solid #1e40af',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Actualizando...
            </div>
          )}
        </div>

        <p style={{ color: '#6b7280', marginBottom: '8px' }}>
          Panel de control para auditores con actualización en tiempo real cada 30 segundos.
        </p>
        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '0.9rem' }}>
          Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </p>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#991b1b',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* Indicador de carga inicial */}
        {loading && resultadosCandidatos.length === 0 && (
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
              <p>Cargando datos en tiempo real...</p>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {!loading || resultadosCandidatos.length > 0 ? (
          <>
            {/* Sección de Estadísticas Generales */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                marginBottom: '20px'
              }}>
                Estadísticas Generales
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <StatCard label="Total de Votos" value={estadisticas.totalVotos.toLocaleString()} />
                <StatCard label="Votos Válidos" value={estadisticas.votosValidos.toLocaleString()} />
                <StatCard label="Votos Nulos" value={estadisticas.votosNulos.toLocaleString()} />
                <StatCard label="Participación" value={`${estadisticas.participacion}%`} />
                <StatCard label="Mesas Escrutadas" value={`${estadisticas.mesasEscrutadas}/${estadisticas.mesasTotal}`} />
                <StatCard label="Progreso del Escrutinio" value={`${Math.round((estadisticas.mesasEscrutadas / estadisticas.mesasTotal) * 100)}%`} />
              </div>
            </div>

            {/* Sección de Resultados por Candidato */}
            <div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                marginBottom: '20px'
              }}>
                Resultados por Candidato
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px'
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
            </div>

            {/* Información adicional */}
            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#6b7280', margin: 0 }}>
                🔄 Los resultados se actualizan automáticamente en tiempo real cada 30 segundos para monitoreo continuo.
              </p>
            </div>
          </>
        ) : null}
      </div>

      {/* Estilos para las animaciones */}
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
