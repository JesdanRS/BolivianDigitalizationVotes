// src/pages/Votacion.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidatoCard from '../components/voting/CandidatoCard';
import Navbar from '../components/common/Navbar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SecurityModal from '../components/common/SecurityModal';
import SuccessModal from '../components/common/SuccessModal';
import { getUserData } from '../services/authService';
import candidatoA from '../assets/images/paz.png';
import candidatoB from '../assets/images/tuto.png';
import imagenCC from '../assets/images/cc.jpg';
import imagenCreemos from '../assets/images/creemos.png';
import imagenMAS from '../assets/images/mas.jpeg';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

// Configuración del backend
const API_BASE_URL = 'http://localhost:5000/api/votaciones';

// Mapeo de imágenes locales para los candidatos
const imagenesLocales = {
  'paz.png': candidatoA,
  'tuto.png': candidatoB,
  'cc.png': imagenCC,
  'cc.jpg': imagenCC,
  'creemos.png': imagenCreemos,
  'mas.png': imagenMAS,
  'mas.jpeg': imagenMAS,
};

const Votacion = () => {
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorBackend, setErrorBackend] = useState(null);
  const [votoSeleccionado, setVotoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [securityBlocked, setSecurityBlocked] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);
  const [yaVoto, setYaVoto] = useState(false);
  const [verificandoVoto, setVerificandoVoto] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const videoRef = React.useRef(null);

  // Verificar autenticación y estado de votación
  useEffect(() => {
    const verificarUsuario = async () => {
      const userData = getUserData();

      if (!userData || !userData._id) {
        // Si no hay usuario autenticado, redirigir al login
        navigate('/login');
        return;
      }

      setUsuario(userData);

      // Verificar si el usuario ya votó
      try {
        const response = await fetch(`${API_BASE_URL}/verificar/${userData._id}`);
        const data = await response.json();

        if (data.success && data.data.haVotado) {
          setYaVoto(true);
        }
      } catch (error) {
        console.error('Error al verificar estado de votación:', error);
      } finally {
        setVerificandoVoto(false);
      }
    };

    verificarUsuario();
  }, [navigate]);

  // Cargar candidatos desde el backend
  useEffect(() => {
    const cargarCandidatos = async () => {
      try {
        setLoading(true);
        setErrorBackend(null);

        const response = await fetch(`${API_BASE_URL}/candidatos`);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          // Mapear los candidatos del backend con las imágenes locales
          const candidatosConImagenes = data.data.map(candidato => ({
            ...candidato,
            id: candidato._id,
            imagen: imagenesLocales[candidato.imagen] || candidatoA
          }));
          setCandidatos(candidatosConImagenes);
          console.log('✅ Candidatos cargados desde el backend:', candidatosConImagenes);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('❌ Error al cargar candidatos del backend:', error);
        setErrorBackend(`No se pudieron cargar los candidatos del servidor. ${error.message}`);

        // Fallback: usar candidatos estáticos si falla el backend
        console.warn('⚠️ Usando candidatos estáticos como fallback');
        setCandidatos([
          {
            id: '1',
            nombre: 'PDC',
            descripcion: 'Partido Demócrata Cristiano, de ideología centrista y humanista, promueve valores cristianos y justicia social.',
            imagen: candidatoA,
          },
          {
            id: '2',
            nombre: 'Libre',
            descripcion: 'Partido Libertad y Refundación, de izquierda, impulsa reformas sociales, justicia económica y participación popular.',
            imagen: candidatoB,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarCandidatos();
  }, []);

  // Detección de rostros con cámara
  React.useEffect(() => {
    if (yaVoto) return; // No activar cámara si ya votó

    let stream;
    let model;
    let intervalId;
    let cancelled = false;
    let detectionHistory = [];
    const DETECTION_INTERVAL = 500;
    const HISTORY_SIZE = 6;
    const CONFIDENCE_THRESHOLD = 0.7;

    async function startCameraAndDetection() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });

        if (cancelled) return;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Esperar a que el video esté listo antes de reproducir
          videoRef.current.onloadedmetadata = async () => {
            if (cancelled || !videoRef.current) return;

            try {
              await videoRef.current.play();
              setCameraActive(true);
              setErrorCamara(null);
            } catch (playError) {
              console.warn('Error al reproducir video:', playError);
              // Intentar de nuevo después de un breve delay
              setTimeout(async () => {
                if (videoRef.current && !cancelled) {
                  try {
                    await videoRef.current.play();
                    setCameraActive(true);
                    setErrorCamara(null);
                  } catch (retryError) {
                    console.error('No se pudo iniciar el video:', retryError);
                    setErrorCamara('No se pudo activar la cámara.');
                    setCameraActive(false);
                  }
                }
              }, 100);
            }
          };
        }

        model = await blazeface.load();

        const detect = async () => {
          if (cancelled) return;
          if (videoRef.current && model) {
            try {
              const predictions = await model.estimateFaces(videoRef.current, false);
              const faceCount = predictions?.length || 0;

              detectionHistory.push(faceCount > 1);
              if (detectionHistory.length > HISTORY_SIZE) {
                detectionHistory.shift();
              }

              if (detectionHistory.length >= 3) {
                const multipleFacesCount = detectionHistory.filter(Boolean).length;
                const confidence = multipleFacesCount / detectionHistory.length;

                if (confidence >= CONFIDENCE_THRESHOLD) {
                  setSecurityBlocked(true);
                } else if (confidence <= (1 - CONFIDENCE_THRESHOLD)) {
                  setSecurityBlocked(false);
                }
              }
            } catch (detectionError) {
              console.warn('Error en detección:', detectionError);
            }
          }
        };

        intervalId = setInterval(detect, DETECTION_INTERVAL);
      } catch (err) {
        console.error('Error al activar cámara/detección:', err);
        setErrorCamara('No se pudo activar la cámara.');
        setCameraActive(false);
        setSecurityBlocked(true);
      }
    }

    startCameraAndDetection();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [yaVoto]);

  const handleRetryDetection = () => {
    setErrorCamara(null);
  };

  const handleVotar = (candidato) => {
    if (securityBlocked) {
      return;
    }
    if (yaVoto) {
      alert('Ya has votado. No puedes votar nuevamente.');
      return;
    }
    setCandidatoSeleccionado(candidato);
    setModalOpen(true);
  };

  const confirmarVoto = async () => {
    try {
      setModalOpen(false);

      if (!usuario || !usuario._id) {
        alert('Error: No se encontró información del usuario. Por favor, inicie sesión nuevamente.');
        navigate('/login');
        return;
      }

      // Enviar el voto al backend con votanteId
      const response = await fetch(`${API_BASE_URL}/votar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidatoId: candidatoSeleccionado.id,
          votanteId: usuario._id
        })
      });

      const data = await response.json();

      if (data.success) {
        setVotoSeleccionado(candidatoSeleccionado.id);
        setYaVoto(true);
        setSuccessModalOpen(true);
        console.log('✅ Voto registrado:', data);
      } else if (response.status === 403) {
        // El usuario ya votó
        setYaVoto(true);
        alert('Ya has votado anteriormente. No puedes votar nuevamente.');
      } else {
        throw new Error(data.message || 'Error al registrar el voto');
      }
    } catch (error) {
      console.error('❌ Error al votar:', error);
      alert(`❌ Error al registrar el voto: ${error.message}\n\nPor favor, verifica que el backend esté ejecutándose.`);
    }
  };

  // Mostrar mensaje de cargando mientras verifica
  if (verificandoVoto) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Verificando estado de votación...</p>
      </div>
    );
  }

  // Mostrar mensaje si ya votó
  if (yaVoto) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        backgroundColor: '#fff',
        color: '#000'
      }}>
        <Navbar />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#1e40af' }}>
              Ya has votado
            </h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Tu voto ha sido registrado exitosamente. No puedes votar nuevamente.
            </p>
            <button
              onClick={() => navigate('/resultados')}
              style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px 30px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Ver Resultados
            </button>
          </div>
        </div>
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

        {/* Mensaje de error del backend */}
        {errorBackend && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            color: '#856404',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            maxWidth: '600px',
            margin: '0 auto 20px'
          }}>
            <strong>⚠️ Advertencia:</strong> {errorBackend}
            <br />
            <small>Mostrando candidatos de ejemplo. Inicia el backend para ver los datos reales.</small>
          </div>
        )}

        {loading ? (
          <p style={{ color: '#666' }}>Cargando candidatos...</p>
        ) : (
          <>
            <p style={{ color: '#000000', marginBottom: '40px' }}>
              Selecciona el candidato que mejor represente tus ideales para las elecciones en Bolivia.
            </p>
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
                  nombre={candidato.nombre}
                  descripcion={candidato.descripcion}
                  imagen={candidato.imagen}
                  onVotar={() => handleVotar(candidato)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Video oculto para detección */}
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'fixed', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }} />

      {/* Modal de seguridad */}
      <SecurityModal
        isOpen={securityBlocked || !cameraActive}
        cameraActive={cameraActive}
        multipleFacesDetected={securityBlocked}
        onRetry={handleRetryDetection}
      />

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarVoto}
        candidato={candidatoSeleccionado}
      />

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigate('/resultados');
        }}
      />
    </div>
  );
};

export default Votacion;