// src/pages/auditoria/ResultadosAuditor.jsx
import React, { useState, useEffect } from 'react';
import AuditNavbar from '../../components/common/AuditNavbar';
import StatCard from '../../components/auditoria/StatCard';
import ResultadoBar from '../../components/voting/ResultadoBar';
import { obtenerEstadisticas } from '../../services/resultadosService';

const ResultadosAuditor = () => {
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      const data = await obtenerEstadisticas(); // puede ser array o un objeto
      let nacional;

      if (Array.isArray(data)) {
        nacional =
          data.find((d) => (d.departamento ?? '').toUpperCase() === 'NACIONAL') ||
          data[0];
      } else {
        nacional = data;
      }

      if (!nacional) {
        setStats(null);
        return;
      }

      const votosValidos = nacional.votosValidos ?? 0;
      const votosNulos = nacional.votosNulos ?? 0;
      const votosBlancos = nacional.votosBlancos ?? 0;
      const totalVotos = votosValidos + votosNulos + votosBlancos;

      setStats({
        totalVotos,
        votosValidos,
        votosNulos,
        votosBlancos,
        participacion: nacional.participacionPorcentaje ?? 0,
        totalVotantes: nacional.totalVotantes ?? 0,
        mesasEscrutadas: nacional.mesasEscrutadas ?? 0, // si tu DTO lo agrega luego
        mesasTotal: nacional.mesasTotal ?? 0,           // idem
      });
      setError('');
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar las estadísticas de resultados.');
    }
  };

  // Carga inicial + actualización cada 30s
  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      setUltimaActualizacion(new Date());
      loadStats();
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  const estadisticas = stats || {
    totalVotos: 0,
    votosValidos: 0,
    votosNulos: 0,
    votosBlancos: 0,
    participacion: 0,
    totalVotantes: 0,
    mesasEscrutadas: 0,
    mesasTotal: 0,
  };

  // De momento, resultados por candidato siguen siendo estáticos
  const resultadosCandidatos = [
    { nombre: 'PDC', porcentaje: 45.2, votos: 6717, color: '#2563eb' },
    { nombre: 'Libre', porcentaje: 38.7, votos: 5735, color: '#dc2626' },
    { nombre: 'Votos en Blanco', porcentaje: 12.8, votos: 1898, color: '#6b7280' },
    { nombre: 'Votos Nulos', porcentaje: 3.3, votos: 489, color: '#ef4444' },
  ];

  const progresoEscrutinio =
    estadisticas.mesasTotal > 0
      ? Math.round((estadisticas.mesasEscrutadas / estadisticas.mesasTotal) * 100)
      : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f9fafb', minHeight: '100dvh', color: '#111' }}>
      <AuditNavbar />

      <div style={{ padding: '24px 40px', width: '95%', maxWidth: '100%', margin: 0 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
          Resultados Electorales - Auditor
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '8px' }}>
          Panel de control para auditores con actualización en tiempo real.
        </p>
        <p style={{ color: '#6b7280', marginBottom: '8px', fontSize: '0.9rem' }}>
          Última actualización:{' '}
          {ultimaActualizacion.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
        {error && (
          <p style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}

        {/* Estadísticas Generales */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            Estadísticas Generales
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <StatCard
              label="Total de Votos"
              value={estadisticas.totalVotos.toLocaleString()}
            />
            <StatCard
              label="Votos Válidos"
              value={estadisticas.votosValidos.toLocaleString()}
            />
            <StatCard
              label="Votos Nulos"
              value={estadisticas.votosNulos.toLocaleString()}
            />
            <StatCard
              label="Votos Blancos"
              value={estadisticas.votosBlancos.toLocaleString()}
            />
            <StatCard
              label="Participación"
              value={`${estadisticas.participacion.toFixed(2)}%`}
            />
            <StatCard
              label="Votantes Inscritos"
              value={estadisticas.totalVotantes.toLocaleString()}
            />
            <StatCard
              label="Mesas Escrutadas"
              value={
                estadisticas.mesasTotal > 0
                  ? `${estadisticas.mesasEscrutadas}/${estadisticas.mesasTotal}`
                  : 'N/D'
              }
            />
            <StatCard
              label="Progreso del Escrutinio"
              value={
                estadisticas.mesasTotal > 0 ? `${progresoEscrutinio}%` : 'N/D'
              }
            />
          </div>
        </div>

        {/* Resultados por Candidato (de momento, ejemplo estático) */}
        <div>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            Resultados por Candidato
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '20px',
            }}
          >
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
        <div
          style={{
            marginTop: '40px',
            padding: '20px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#6b7280', margin: 0 }}>
            Los resultados se consultan al backend y se actualizan cada 30 segundos para monitoreo continuo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultadosAuditor;