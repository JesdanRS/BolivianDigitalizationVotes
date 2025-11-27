import React from 'react';

const Th = ({ children }) => (
  <th
    style={{
      textAlign: 'left',
      padding: '10px 12px',
      fontSize: 12,
      color: '#6b7280',
      borderBottom: '1px solid #e5e7eb',
    }}
  >
    {children}
  </th>
);

const Td = ({ children }) => (
  <td
    style={{
      padding: '12px',
      borderBottom: '1px solid #f3f4f6',
      fontSize: 14,
      color: '#111',
    }}
  >
    {children}
  </td>
);

const Badge = ({ children, bg = '#eef2ff', fg = '#1f2937' }) => (
  <span
    style={{
      background: bg,
      color: fg,
      padding: '4px 8px',
      borderRadius: 999,
      fontSize: 12,
    }}
  >
    {children}
  </span>
);

/** props: items, onView?(item) */
const LogTable = ({ items = [], onView }) => (
  <div
    style={{
      overflow: 'auto',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      background: '#fff',
    }}
  >
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
      <thead>
        <tr>
          <Th>ID</Th>
          <Th>Fecha</Th>
          <Th>Tipo</Th>
          <Th>Severidad</Th>
          <Th>Módulo</Th>
          <Th>Usuario (CI)</Th>
          <Th>Detalle</Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody>
        {items.map((x) => {
          // Formateo seguro de fecha
          const fecha = x.fecha
            ? new Date(x.fecha).toLocaleString('es-BO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            : 'N/D';

          // CI 00000000 se muestra como Anónimo
          const usuario =
            x.usuario === '00000000' ? 'Anónimo' : (x.usuario || 'N/D');

          const isError = x.severidad === 'ERROR';

          return (
            <tr key={x.id}>
              <Td>{x.id}</Td>
              <Td>{fecha}</Td>
              <Td>
                <Badge>{x.tipo}</Badge>
              </Td>
              <Td>
                <Badge
                  bg={isError ? '#fee2e2' : '#fef3c7'}
                  fg={isError ? '#991b1b' : '#92400e'}
                >
                  {x.severidad}
                </Badge>
              </Td>
              <Td>
                <Badge bg="#ecfeff" fg="#155e75">
                  {x.modulo}
                </Badge>
              </Td>
              <Td>{usuario}</Td>
              <Td style={{ color: '#4b5563' }}>{x.detalle}</Td>
              <Td>
                <button
                  onClick={() => onView && onView(x)}
                  style={{
                    color: '#2563eb',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Ver
                </button>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default LogTable;