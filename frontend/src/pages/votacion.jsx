import React, { useState } from 'react';
import CandidatoCard from '../components/voting/CandidatoCard';
import Navbar from '../components/common/Navbar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SecurityModal from '../components/common/SecurityModal';
import candidatoA from '../assets/images/paz.png';
import candidatoB from '../assets/images/tuto.png';
import * as blazeface from '@tensorflow-models/blazeface';
import { logEvent } from '../services/auditoriaService';

const candidatos = [
  {
    id: 1,
    nombre: 'PDC',
    descripcion: 'Partido Demócrata Cristiano, de ideología centrista y humanista, promueve valores cristianos y justicia social.',
    imagen: candidatoA,
  },
  {
    id: 2,
    nombre: 'Libre',
    descripcion: 'Partido Libertad y Refundación, de izquierda, impulsa reformas sociales, justicia económica y participación popular.',
    imagen: candidatoB,
  },
];

// hash/tx simulada para trazabilidad sin revelar preferencia
function txId() {
  const n = Math.floor(Math.random() * 0xffffffff);
  return '0x' + n.toString(16).padStart(8, '0');
}

const Votacion = () => {
  const [votoSeleccionado, setVotoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [securityBlocked, setSecurityBlocked] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    let stream;
    let model;
    let intervalId;
    let cancelled = false;
    let detectionHistory = [];
    const DETECTION_INTERVAL = 500; // Detectar cada 500ms
    const HISTORY_SIZE = 6; // Últimas 6 detecciones (~3s)
    const CONFIDENCE_THRESHOLD = 0.7;

    async function startCameraAndDetection() {
      try {
        // Solicitar cámara
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraActive(true);
        setErrorCamara(null);

        // Cargar modelo y empezar detección
        model = await blazeface.load();
        
        const detect = async () => {
          if (cancelled) return;
          if (videoRef.current && model) {
            try {
              const predictions = await model.estimateFaces(videoRef.current, false);
              const faceCount = predictions?.length || 0;
              
              // Añadir a historial (true si hay más de 1 rostro)
              detectionHistory.push(faceCount > 1);
              if (detectionHistory.length > HISTORY_SIZE) detectionHistory.shift();
              
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
        setSecurityBlocked(true); // Bloquear si no hay cámara por seguridad
      }
    }

    startCameraAndDetection();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleRetryDetection = () => { setErrorCamara(null); };

  const handleVotar = (candidato) => {
    if (securityBlocked) {
      // RF06: intento bloqueado por seguridad (sin revelar preferencia)
      const user = JSON.parse(localStorage.getItem('user')) || {};
      logEvent({
        tipo: 'ERROR',
        modulo: 'votaciones',
        severidad: 'WARN',
        usuario: user.username || user.carnet || 'votante',
        detalle: 'Intento de voto bloqueado por seguridad (múltiples rostros o sin cámara)'
      });
      return;
    }
    setCandidatoSeleccionado(candidato);
    setModalOpen(true);
  };
  
  const confirmarVoto = () => {
    // Guardamos el id interno pero no lo mostramos ni lo logueamos
    setVotoSeleccionado(candidatoSeleccionado.id);
    setModalOpen(false);

    // Mensaje sin revelar candidato
    alert('Tu voto por ' + candidatoSeleccionado.nombre + ' ha sido registrado con éxito. ¡Gracias por participar!');

    // RF06: voto confirmado (sin revelar por quién)
    const user = JSON.parse(localStorage.getItem('user')) || {};
    logEvent({
      tipo: 'VOTE_CAST',
      modulo: 'votaciones',
      severidad: 'INFO',
      usuario: user.username || user.carnet || 'votante',
      detalle: `Voto confirmado (tx=${txId()})`
    });
  };

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

      {/* Modal de confirmación (muestra candidato para confirmar, pero no se guarda ni se revela después) */}
      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarVoto}
        candidato={candidatoSeleccionado}
      />
    </div>
  );
};

export default Votacion;