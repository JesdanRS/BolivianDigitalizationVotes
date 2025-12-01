import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

function Votacion() {
  const { keycloak, initialized } = useKeycloak();

  // Estado para mensajes de éxito/error
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Lista de candidatos (podría venir de una API, pero por ahora estática como solicitaste)
  const candidatos = [
    { id: 1, nombre: 'PDC', descripcion: 'Partido Demócrata Cristiano' },
    { id: 2, nombre: 'Libre', descripcion: 'Partido Libertad y Refundación' }
  ];

  const realizarVoto = async (candidatoSeleccionado) => {
    if (!initialized || !keycloak?.token) {
      setError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    setCargando(true);
    setError(null);
    setMensaje(null);

    try {
      // Datos del voto según tu DTO VotacionCreacionDto
      const votoData = {
        partido: candidatoSeleccionado.nombre,
        candidato: candidatoSeleccionado.nombre, // Asumiendo que votas por el partido/candidato
        localidad: 'La Paz', // Valor por defecto para prueba
        fecha: new Date().toISOString()
      };

      console.log('Enviando voto:', votoData);

      const response = await fetch('http://localhost:8080/api/votaciones', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(votoData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Voto registrado:', data);
      setMensaje(`¡Voto exitoso por ${candidatoSeleccionado.nombre}! ID de voto: ${data.id}`);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (!initialized) {
    return <div>Cargando Keycloak...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Sistema de Votación (Test)</h2>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Usuario:</strong> {keycloak.tokenParsed?.preferred_username || 'Anónimo'}</p>
        <p><strong>Rol:</strong> {keycloak.hasRealmRole('votante') ? 'Votante' : 'Otro'}</p>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          marginBottom: '15px',
          borderRadius: '4px'
        }}>
          Error: {error}
        </div>
      )}

      {mensaje && (
        <div style={{
          padding: '10px',
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          marginBottom: '15px',
          borderRadius: '4px'
        }}>
          {mensaje}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {candidatos.map((c) => (
          <div key={c.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            width: '250px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>{c.nombre}</h3>
            <p style={{ color: '#666' }}>{c.descripcion}</p>
            <button
              onClick={() => realizarVoto(c)}
              disabled={cargando}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                opacity: cargando ? 0.7 : 1
              }}
            >
              {cargando ? 'Enviando...' : 'Votar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Votacion;