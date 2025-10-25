import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/auditoria/StatCard';
import ResultadoBar from '../components/voting/ResultadoBar';

const Resultados = () => {
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  // Simular actualización cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      setUltimaActualizacion(new Date());
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  // Datos de ejemplo - estos vendrían del backend en producción
  const estadisticas = {
    totalVotos: 15420,
    votosValidos: 14850,
    votosNulos: 570,
    participacion: 78.5,
    mesasEscrutadas: 1247,
    mesasTotal: 1560
  };

  const resultadosCandidatos = [
    { nombre: 'PDC', porcentaje: 45.2, votos: 6717, color: '#2563eb' },
    { nombre: 'Libre', porcentaje: 38.7, votos: 5735, color: '#dc2626' },
    { nombre: 'Votos en Blanco', porcentaje: 12.8, votos: 1898, color: '#6b7280' },
    { nombre: 'Votos Nulos', porcentaje: 3.3, votos: 489, color: '#ef4444' }
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
            Los resultados se actualizan cada 5 minutos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
