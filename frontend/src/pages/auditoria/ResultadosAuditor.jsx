import React, { useState, useEffect } from 'react';
import AuditNavbar from '../../components/common/AuditNavbar';
import StatCard from '../../components/auditoria/StatCard';
import ResultadoBar from '../../components/voting/ResultadoBar';

const ResultadosAuditor = () => {
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  // Simular actualización en tiempo real cada 30 segundos para auditores
  useEffect(() => {
    const interval = setInterval(() => {
      setUltimaActualizacion(new Date());
    }, 30 * 1000); // 30 segundos

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
    <div style={{fontFamily:'Arial, sans-serif',background:'#f9fafb',minHeight:'100dvh',color:'#111'}}>
      <AuditNavbar />

      <div style={{padding:'24px 40px', width:'95%', maxWidth:'100%', margin:0}}>
        <h1 style={{fontSize:'2.5rem',fontWeight:800,marginBottom:'16px'}}>Resultados Electorales - Auditor</h1>
        <p style={{color:'#6b7280',marginBottom:'8px'}}>
          Panel de control para auditores con actualización en tiempo real.
        </p>
        <p style={{color:'#6b7280',marginBottom:'32px',fontSize:'0.9rem'}}>
          Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </p>

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
            Los resultados se actualizan en tiempo real cada 30 segundos para monitoreo continuo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultadosAuditor;
