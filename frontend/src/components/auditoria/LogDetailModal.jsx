import React from 'react';

const Row = ({ k, v }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr',
      gap: 10,
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    }}
  >
    <div style={{ color: '#6b7280' }}>{k}</div>
    <div style={{ color: '#111', wordBreak: 'break-word' }}>{v}</div>
  </div>
);

const LogDetailModal = ({ open, onClose, log }) => {
  if (!open) return null;

  // Fecha segura
  const fecha =
    log?.fecha
      ? new Date(log.fecha).toLocaleString('es-BO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : 'N/D';

  // CI 00000000 => Anónimo
  const usuario =
    log?.usuario === '00000000'
      ? 'Anónimo'
      : (log?.usuario || 'N/D');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 'min(720px, 92vw)',
          maxHeight: '85vh',
          overflow: 'auto',
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 15px 40px rgba(0,0,0,.2)',
          padding: 22,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Detalle del evento {log?.id ? `#${log.id}` : ''}
          </h2>
          <button
            onClick={onClose}
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>

        {!log ? (
          <div>Cargando…</div>
        ) : (
          <div>
            <Row k="Fecha" v={fecha} />
            <Row k="Tipo" v={log.tipo || 'N/D'} />
            <Row k="Severidad" v={log.severidad || 'N/D'} />
            <Row k="Módulo" v={log.modulo || 'N/D'} />
            <Row k="Usuario (CI)" v={usuario} />
            <Row k="IP" v={log.ip || 'N/D'} />
            <Row k="Correlación" v={log.correlacion || 'N/D'} />
            <Row k="Detalle" v={log.detalle || 'N/D'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDetailModal;
