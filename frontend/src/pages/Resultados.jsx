import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/auditoria/StatCard';
import ResultadoBar from '../components/voting/ResultadoBar';

const Resultados = () => {
  const { keycloak, initialized } = useKeycloak();

  const [resultados, setResultados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  // Función para cargar datos desde la API
  const cargarDatos = async () => {
    if (!initialized || !keycloak?.token) {
      console.warn('No hay token todavía');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Cargar estadísticas
      const statsResponse = await fetch('http://localhost:8080/api/resultados/resultados/estadisticas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
      });

      if (!statsResponse.ok) {
        throw new Error(`Error HTTP: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      console.log('Estadísticas:', statsData);

      // Si hay datos de estadísticas, tomar la primera
      if (statsData && statsData.length > 0) {
        setEstadisticas(statsData[0]);
      }

      // Cargar resultados de todas las mesas
      const resultsResponse = await fetch('http://localhost:8080/api/resultados/resultados', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
      });

      if (!resultsResponse.ok) {
        throw new Error(`Error HTTP: ${resultsResponse.status}`);
      }

      const resultsData = await resultsResponse.json();
      console.log('Resultados:', resultsData);
      setResultados(resultsData);
      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Cargar datos al montar el componente y cuando el token esté listo
  useEffect(() => {
    if (initialized && keycloak?.token) {
      cargarDatos();
    }
  }, [initialized, keycloak?.token]);

  // Auto-actualización cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      cargarDatos();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [initialized, keycloak?.token]);

  // Calcular agregados para la vista (datos de ejemplo si no hay estadísticas)
  const calcularEstadisticas = () => {
    if (estadisticas) {
      return {
        totalVotos: estadisticas.votosValidos + estadisticas.votosNulos + estadisticas.votosBlancos,
        votosValidos: estadisticas.votosValidos,
        votosNulos: estadisticas.votosNulos,
        participacion: estadisticas.participacionPorcentaje || 0,
        mesasEscrutadas: resultados.length,
        mesasTotal: resultados.length, // Ajustar según necesidad
      };
    }
    return {
      totalVotos: 0,
      votosValidos: 0,
      votosNulos: 0,
      participacion: 0,
      mesasEscrutadas: 0,
      mesasTotal: 0,
    };
  };

  const stats = calcularEstadisticas();

  // Por ahora, mostrar datos agregados básicos
  // En producción, estos vendrían de un endpoint específico de candidatos
  const resultadosCandidatos = [
    { nombre: 'Votos Válidos', porcentaje: stats.totalVotos > 0 ? (stats.votosValidos / stats.totalVotos * 100).toFixed(1) : 0, votos: stats.votosValidos, color: '#2563eb' },
    { nombre: 'Votos Nulos', porcentaje: stats.totalVotos > 0 ? (stats.votosNulos / stats.totalVotos * 100).toFixed(1) : 0, votos: stats.votosNulos, color: '#dc2626' },
  ];

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
        <p style={{ color: '#000000', marginBottom: '40px' }}>
          Resultados oficiales de las elecciones presidenciales en Bolivia.
        </p>

        {/* Estado de carga */}
        {cargando && (
          <div style={{ padding: '20px' }}>
            <p>Cargando resultados...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div style={{ padding: '20px', color: 'red' }}>
            <p>Error al cargar resultados: {error}</p>
            <button onClick={cargarDatos} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        )}

        {/* Mostrar datos solo si no hay error y no está cargando */}
        {!cargando && !error && (
          <>
            {/* Sección de Estadísticas Generales */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              padding: '0',
              width: '100%',
              marginBottom: '40px'
            }}>
              <StatCard label="Total de Votos" value={stats.totalVotos.toLocaleString()} />
              <StatCard label="Votos Válidos" value={stats.votosValidos.toLocaleString()} />
              <StatCard label="Votos Nulos" value={stats.votosNulos.toLocaleString()} />
              <StatCard label="Participación" value={`${stats.participacion.toFixed(1)}%`} />
              <StatCard label="Mesas Escrutadas" value={`${stats.mesasEscrutadas}/${stats.mesasTotal}`} />
              <StatCard label="Progreso del Escrutinio" value={stats.mesasTotal > 0 ? `${Math.round((stats.mesasEscrutadas / stats.mesasTotal) * 100)}%` : '0%'} />
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
                Los resultados se actualizan cada 5 minutos
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Resultados;
