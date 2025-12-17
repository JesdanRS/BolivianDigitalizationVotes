import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import AuditNavbar from '../../components/common/AuditNavbar';
import LogTable from '../../components/auditoria/LogTable';
import LogDetailModal from '../../components/auditoria/LogDetailModal';
import { fetchLogs, fetchLogById, exportToCsv } from '../../services/auditoriaService';

const Select = props => <select {...props} style={{
  padding: '10px 12px', border: '1px solid #e5e7eb',
  borderRadius: 10, background: '#fff'
}} />;
const Input = props => <input {...props} style={{
  padding: '10px 12px', border: '1px solid #e5e7eb',
  borderRadius: 10, width: props.type === 'datetime-local' ? 200 : 260
}} />;
const Button = props => <button {...props} style={{
  padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb',
  background: '#111', color: '#fff', cursor: 'pointer'
}} />;

const Registros = () => {
  const { keycloak, initialized } = useKeycloak();
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('TODO');
  const [sev, setSev] = useState('TODO');
  const [mod, setMod] = useState('TODO');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [error, setError] = useState(null);
  const [exportando, setExportando] = useState(false);
  const [fechaError, setFechaError] = useState('');

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Función para obtener la fecha/hora actual en formato datetime-local
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    // Restar offset de zona horaria
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Validar fechas
  const validateDates = (inicio, fin) => {
    const now = new Date();

    if (inicio) {
      const fechaInicioDate = new Date(inicio);
      if (fechaInicioDate > now) {
        setFechaError('La fecha de inicio no puede ser futura');
        return false;
      }
    }

    if (fin) {
      const fechaFinDate = new Date(fin);
      if (fechaFinDate > now) {
        setFechaError('La fecha de fin no puede ser futura');
        return false;
      }
    }

    if (inicio && fin) {
      const fechaInicioDate = new Date(inicio);
      const fechaFinDate = new Date(fin);
      if (fechaInicioDate > fechaFinDate) {
        setFechaError('La fecha de inicio debe ser anterior o igual a la fecha de fin');
        return false;
      }
    }

    setFechaError('');
    return true;
  };

  const load = async () => {
    if (!keycloak?.token) {
      setError('No hay sesión activa');
      return;
    }

    // Validar fechas antes de cargar
    if (!validateDates(fechaInicio, fechaFin)) {
      return;
    }

    try {
      setError(null);
      // Convertir fechas a formato ISO si existen
      const inicio = fechaInicio ? new Date(fechaInicio).toISOString() : undefined;
      const fin = fechaFin ? new Date(fechaFin).toISOString() : undefined;

      const result = await fetchLogs({
        page, q, tipo, severidad: sev, modulo: mod,
        fechaInicio: inicio, fechaFin: fin
      }, keycloak.token);
      setData(result);
    } catch (err) {
      console.error('Error al cargar registros:', err);
      setError('Error al cargar los registros de auditoría');
    }
  };

  useEffect(() => {
    if (initialized && keycloak?.token) {
      load();
    }
    /* eslint-disable-next-line */
  }, [page, initialized, keycloak]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

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

  const handleExportCsv = async () => {
    if (!keycloak?.token) {
      setError('No hay sesión activa');
      return;
    }

    setExportando(true);
    setError(null);
    try {
      await exportToCsv(keycloak.token);
      // Mostrar mensaje de éxito temporal
      const successMsg = 'CSV descargado exitosamente';
      setError(null);
      alert(successMsg); // Podrías reemplazar esto con un mensaje más elegante
    } catch (err) {
      console.error('Error al exportar CSV:', err);
      setError('Error al exportar los registros a CSV');
    } finally {
      setExportando(false);
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
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f9fafb' }}>
      <AuditNavbar />
      <div style={{ padding: '24px 40px', width: '95%', maxWidth: '100%', margin: 0 }}>
        {/* Header con título y botón de exportar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Registros del Sistema</h1>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exportando}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: 'none',
              background: exportando ? '#9ca3af' : '#10b981',
              color: '#fff',
              cursor: exportando ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!exportando) {
                e.currentTarget.style.background = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!exportando) {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
            }}
          >
            {exportando ? '⏳ Descargando...' : '📥 Descargar registros'}
          </button>
        </div>

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

        {/* Mensaje de error de fechas */}
        {fechaError && (
          <div style={{
            padding: '12px 15px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            marginBottom: '20px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            border: '1px solid #ffeeba'
          }}>
            ⚠️ {fechaError}
          </div>
        )}

        {/* Formulario de filtros */}
        <form onSubmit={onSearch} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <Input placeholder="Buscar (id, usuario, detalle...)" value={q} onChange={e => setQ(e.target.value)} />
          <Select value={tipo} onChange={e => setTipo(e.target.value)}>
            {['TODO', 'LOGIN', 'LOGIN_FALLIDO', 'VOTO_EMITIDO', 'CREAR_CANDIDATO', 'ACTUALIZAR_CANDIDATO', 'ELIMINAR_CANDIDATO', 'ERROR', 'CONSULTA'].map(v => <option key={v}>{v}</option>)}
          </Select>
          <Select value={sev} onChange={e => setSev(e.target.value)}>
            {['TODO', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map(v => <option key={v}>{v}</option>)}
          </Select>
          <Select value={mod} onChange={e => setMod(e.target.value)}>
            {['TODO', 'usuarios', 'votaciones', 'resultados', 'candidatos', 'auditoria'].map(v => <option key={v}>{v}</option>)}
          </Select>
          <Input
            type="datetime-local"
            placeholder="Fecha inicio"
            value={fechaInicio}
            onChange={e => {
              setFechaInicio(e.target.value);
              validateDates(e.target.value, fechaFin);
            }}
            max={getCurrentDateTimeLocal()}
            title="Fecha de inicio (no puede ser futura)"
          />
          <Input
            type="datetime-local"
            placeholder="Fecha fin"
            value={fechaFin}
            onChange={e => {
              setFechaFin(e.target.value);
              validateDates(fechaInicio, e.target.value);
            }}
            max={getCurrentDateTimeLocal()}
            title="Fecha de fin (no puede ser futura)"
          />
          <Button
            type="submit"
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              background: '#6366f1',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🔍 Aplicar Filtros
          </Button>
        </form>

        <LogTable items={data.items} onView={handleView} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ color: '#6b7280', fontSize: 12 }}>Total: {data.total}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
            <div style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff' }}>
              Página {page} de {data.pages}
            </div>
            <Button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}>Siguiente</Button>
          </div>
        </div>
      </div>

      <LogDetailModal open={open} onClose={() => setOpen(false)} log={selected} />
    </div>
  );
};
export default Registros;

