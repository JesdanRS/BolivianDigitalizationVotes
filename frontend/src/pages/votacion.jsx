// src/pages/Votacion.jsx

import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import CandidatoCard from '../components/voting/CandidatoCard';
import Navbar from '../components/common/Navbar';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Votacion = () => {
  const { keycloak, initialized } = useKeycloak();
  const [candidatos, setCandidatos] = useState([]);
  const [votoSeleccionado, setVotoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [enviandoVoto, setEnviandoVoto] = useState(false);
  const [cargandoCandidatos, setCargandoCandidatos] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Cargar candidatos desde la API
  useEffect(() => {
    const fetchCandidatos = async () => {
      if (!initialized || !keycloak?.token) return;

      setCargandoCandidatos(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/ms-candidatos/api/candidatos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar candidatos: ${response.status}`);
        }

        const data = await response.json();
        console.log('Candidatos cargados:', data);
        setCandidatos(data);

      } catch (err) {
        console.error('Error al cargar candidatos:', err);
        setError(`No se pudieron cargar los candidatos: ${err.message}`);
      } finally {
        setCargandoCandidatos(false);
      }
    };

    if (initialized && keycloak?.token) {
      fetchCandidatos();
    }
  }, [initialized, keycloak?.token]);

  const handleVotar = (candidato) => {
    setCandidatoSeleccionado(candidato);
    setModalOpen(true);
    setError(null);
    setMensaje(null);
  };

  const confirmarVoto = async () => {
    if (!initialized || !keycloak?.token) {
      setError('Error: No hay sesión activa. Por favor, recarga la página.');
      setModalOpen(false);
      return;
    }

    setEnviandoVoto(true);

    try {
      // Datos del voto según VotacionCreacionDto
      const votoData = {
        partido: candidatoSeleccionado.partido,
        candidato: `${candidatoSeleccionado.nombreCompletoPresidente} - ${candidatoSeleccionado.nombreCompletoVicepresidente}`,
        localidad: 'La Paz',
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
      console.log('Respuesta del servidor:', data);

      setVotoSeleccionado(candidatoSeleccionado.id);
      setModalOpen(false);
      setMensaje(`¡Voto registrado exitosamente! Has votado por: ${candidatoSeleccionado.partido}`);

    } catch (err) {
      console.error('Error al enviar voto:', err);
      setError(`Error al registrar el voto: ${err.message}`);
      setModalOpen(false);
    } finally {
      setEnviandoVoto(false);
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
    <div style={{
      fontFamily: 'Arial, sans-serif',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#fff',
      color: '#000',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div style={{
        padding: '40px',
        margin: '0',
        textAlign: 'center',
        width: '100%',
        flex: '1',
        overflow: 'auto'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Elige tu Candidato</h1>
        <p style={{ color: '#000000', marginBottom: '40px' }}>
          Selecciona el candidato que mejor represente tus ideales para las elecciones en Bolivia.
        </p>

        {/* Mensajes de éxito o error */}
        {mensaje && (
          <div style={{
            padding: '15px',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            marginBottom: '20px',
            borderRadius: '8px',
            fontSize: '1.1rem'
          }}>
            {mensaje}
          </div>
        )}

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            marginBottom: '20px',
            borderRadius: '8px',
            fontSize: '1.1rem'
          }}>
            {error}
          </div>
        )}

        {/* Estado de carga de candidatos */}
        {cargandoCandidatos && (
          <div style={{ fontSize: '1.2rem', color: '#666' }}>
            Cargando candidatos...
          </div>
        )}

        {/* Lista de candidatos */}
        {!cargandoCandidatos && candidatos.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            padding: '0',
            width: '100%'
          }}>
            {candidatos.map((candidato) => (
              <CandidatoCard
                key={candidato.id}
                partido={candidato.partido}
                nombrePresidente={candidato.nombreCompletoPresidente}
                nombreVicepresidente={candidato.nombreCompletoVicepresidente}
                descripcion={candidato.descripcion}
                onVotar={() => handleVotar(candidato)}
              />
            ))}
          </div>
        )}

        {/* Sin candidatos disponibles */}
        {!cargandoCandidatos && candidatos.length === 0 && !error && (
          <div style={{ fontSize: '1.2rem', color: '#666' }}>
            No hay candidatos disponibles en este momento.
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => !enviandoVoto && setModalOpen(false)}
        onConfirm={confirmarVoto}
        candidato={candidatoSeleccionado}
        loading={enviandoVoto}
      />
    </div>
  );
};

export default Votacion;