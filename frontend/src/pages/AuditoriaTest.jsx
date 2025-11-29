import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

function AuditoriaTest() {
  const { keycloak, initialized } = useKeycloak();

  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async () => {
    if (!initialized || !keycloak?.token) {
      console.warn('No hay token todavía');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auditoria/eventos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta API:', data);
      setEventos(data);      // aquí guardamos el array de eventos
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-BO');
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>Prueba Auditoría vía Gateway</h2>

      <button onClick={callApi} disabled={cargando}>
        {cargando ? 'Cargando...' : 'Probar endpoint protegido'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '8px' }}>
          Error al cargar eventos: {error}
        </p>
      )}

      {eventos.length > 0 && (
        <table
          style={{
            marginTop: '16px',
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Fecha</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Tipo</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Severidad</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Módulo</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Usuario</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>IP</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Correlación</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((ev) => (
              <tr key={ev.id}>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.id}</td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>
                  {formatearFecha(ev.fecha)}
                </td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.tipo}</td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.severidad}</td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.modulo}</td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.usuario}</td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.ip}</td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.correlacion}</td>
                <td style={{ border: '1px solid #eee', padding: '4px' }}>{ev.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {eventos.length === 0 && !cargando && !error && (
        <p style={{ marginTop: '8px' }}>
          No hay eventos cargados todavía. Pulsa el botón para consultar.
        </p>
      )}
    </div>
  );
}

export default AuditoriaTest;