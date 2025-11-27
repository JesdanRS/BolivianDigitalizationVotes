import React, { useEffect, useState } from 'react';
import AuditNavbar from '../../components/common/AuditNavbar';
import LogTable from '../../components/auditoria/LogTable';
import LogDetailModal from '../../components/auditoria/LogDetailModal';
import { fetchLogs, fetchLogById } from '../../services/auditoriaService';

const Select = ({ style, ...props }) => (
  <select
    {...props}
    style={{
      padding: '10px 12px',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      background: '#fff',
      ...(style || {}),
    }}
  />
);

const Input = ({ style, ...props }) => (
  <input
    {...props}
    style={{
      padding: '10px 12px',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      width: 260,
      ...(style || {}),
    }}
  />
);

const Button = ({ style, ...props }) => (
  <button
    {...props}
    style={{
      padding: '10px 14px',
      borderRadius: 10,
      border: '1px solid #e5e7eb',
      background: props.disabled ? '#9ca3af' : '#111',
      color: '#fff',
      cursor: props.disabled ? 'default' : 'pointer',
      ...(style || {}),
    }}
  />
);

// Tipos y severidades reales (+ TODO)
const TIPO_OPCIONES = [
  'TODO',
  'LOGIN',
  'LOGIN_FALLIDO',
  'SOLICITAR_CODIGO',
  'SOLICITAR_CODIGO_FALLIDO',
  'VERIFICAR_CODIGO_OK',
  'VERIFICAR_CODIGO_FALLIDO',
  'CARGA_MASIVA_USUARIOS',
  'VOTO_EMITIDO',
  'CREAR_CANDIDATO',
  'ACTUALIZAR_CANDIDATO',
  'ELIMINAR_CANDIDATO',
  'CONSULTA',
  'ELIMINACION',
  'ERROR',
];

const SEVERIDAD_OPCIONES = ['TODO', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];

const MODULO_OPCIONES = [
  'TODO',
  'usuarios',
  'votaciones',
  'resultados',
  'candidatos',
  'auditoria',
];

const Registros = () => {
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('TODO');
  const [sev, setSev] = useState('TODO');
  const [mod, setMod] = useState('TODO');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const sortByFechaDesc = (a, b) => {
    const da = a.fecha ? new Date(a.fecha).getTime() : 0;
    const db = b.fecha ? new Date(b.fecha).getTime() : 0;
    if (db !== da) return db - da;
    return (b.id ?? 0) - (a.id ?? 0);
  };

  const load = async (p = page) => {
    const res = await fetchLogs({
      page: p,
      q,
      tipo,
      severidad: sev,
      modulo: mod,
      inicio: fechaInicio || undefined, // FECHA INICIO
      fin: fechaFin || undefined,       // FECHA FINAL
    });

    const sortedItems = [...(res.items || [])].sort(sortByFechaDesc);
    setData({ ...res, items: sortedItems });
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await load(1);
  };

  const handleView = async (item) => {
    setOpen(true);
    setSelected(null);
    try {
      const full = await fetchLogById(item.id);
      setSelected(full);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f9fafb' }}>
      <AuditNavbar />
      <div style={{ padding: '24px 40px', width: '95%', maxWidth: '100%', margin: 0 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>
          Registros del Sistema
        </h1>

        <form
          onSubmit={onSearch}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}
        >
          <Input
            placeholder="Buscar (id, usuario, detalle...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPO_OPCIONES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>

          <Select value={sev} onChange={(e) => setSev(e.target.value)}>
            {SEVERIDAD_OPCIONES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>

          <Select value={mod} onChange={(e) => setMod(e.target.value)}>
            {MODULO_OPCIONES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>

          {/* Filtro por fecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#4b5563' }}>
              Desde (fecha inicio)
            </span>
            <Input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{ width: 180 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#4b5563' }}>
              Hasta antes de (fecha final)
            </span>
            <Input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{ width: 180 }}
            />
          </div>

          <Button type="submit">Filtrar</Button>
        </form>

        <LogTable items={data.items} onView={handleView} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <div style={{ color: '#6b7280', fontSize: 12 }}>Total: {data.total}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Anterior
            </Button>
            <div
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                background: '#fff',
              }}
            >
              Página {page} de {data.pages}
            </div>
            <Button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      <LogDetailModal open={open} onClose={() => setOpen(false)} log={selected} />
    </div>
  );
};

export default Registros;