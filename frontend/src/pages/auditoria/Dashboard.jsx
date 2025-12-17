import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import AuditNavbar from '../../components/common/AuditNavbar';
import StatCard from '../../components/auditoria/StatCard';
import { fetchKpis, fetchLogs, fetchLogById } from '../../services/auditoriaService';
import LogTable from '../../components/auditoria/LogTable';
import LogDetailModal from '../../components/auditoria/LogDetailModal';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { keycloak, initialized } = useKeycloak();
  const [kpis, setKpis] = useState({ total: 0, errores: 0, votos: 0, actas: 0 });
  const [recent, setRecent] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo cargar datos si Keycloak está inicializado y tenemos token
    if (!initialized || !keycloak?.token) {
      return;
    }

    const loadData = async () => {
      try {
        setError(null);
        const kpisData = await fetchKpis(keycloak.token);
        setKpis(kpisData);

        const logsData = await fetchLogs({ page: 1, pageSize: 6 }, keycloak.token);
        setRecent(logsData.items);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos de auditoría. Por favor, intenta de nuevo.');
      }
    };

    loadData();
  }, [initialized, keycloak]);

  const handleView = async (item) => {
    if (!keycloak?.token) {
      setError('No hay sesión activa');
      return;
    }

    setOpen(true);
    setSelected(null);
    try {
      const full = await fetchLogById(item.id, keycloak.token);
      setSelected(full);
    } catch (err) {
      console.error('Error al obtener detalle del registro:', err);
      setError('No se pudo cargar el detalle del registro');
      setOpen(false);
    }
  };

  // Mostrar mensaje de carga mientras Keycloak se inicializa
  if (!initialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Cargando autenticación...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f9fafb', minHeight: '100dvh', color: '#111' }}>
      <AuditNavbar />

      <div style={{ padding: '24px 40px', width: '95%', maxWidth: '100%', margin: 0 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>Panel de Auditoría</h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Visión general de eventos, actividad reciente y accesos.
        </p>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            marginBottom: '20px',
            borderRadius: '8px',
            fontSize: '1rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Eventos totales" value={kpis.total} />
          <StatCard label="Errores" value={kpis.errores} />
          <StatCard label="Votos registrados" value={kpis.votos} />
          <StatCard label="Actas registradas" value={kpis.actas} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Actividad reciente</h2>
          <Link to="/auditoria/registros" style={{ color: '#2563eb', textDecoration: 'none' }}>Ver todos los registros →</Link>
        </div>
        <LogTable items={recent} onView={handleView} />
      </div>

      <LogDetailModal open={open} onClose={() => setOpen(false)} log={selected} />
    </div>
  );
};
export default Dashboard;

