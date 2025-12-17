import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import AuditNavbar from '../../components/common/AuditNavbar';
import LogTable from '../../components/auditoria/LogTable';
import LogDetailModal from '../../components/auditoria/LogDetailModal';
import { fetchLogs, fetchLogById } from '../../services/auditoriaService';

const Select = props => <select {...props} style={{
  padding: '10px 12px', border: '1px solid #e5e7eb',
  borderRadius: 10, background: '#fff'
}} />;
const Input = props => <input {...props} style={{
  padding: '10px 12px', border: '1px solid #e5e7eb',
  borderRadius: 10, width: 260
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
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    if (!keycloak?.token) {
      setError('No hay sesión activa');
      return;
    }

    try {
      setError(null);
      const result = await fetchLogs({ page, q, tipo, severidad: sev, modulo: mod }, keycloak.token);
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Registros del Sistema</h1>

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
          <Button type="submit">Filtrar</Button>
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

