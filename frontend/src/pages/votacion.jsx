// src/pages/Votacion.jsx

import React, { useState } from 'react';
import CandidatoCard from '../components/voting/CandidatoCard';
import Navbar from '../components/common/Navbar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SecurityModal from '../components/common/SecurityModal';
import candidatoA from '../assets/images/paz.png';
import candidatoB from '../assets/images/tuto.png';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

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
    const DETECTION_INTERVAL = 500; // Detectar cada 500ms en lugar de cada frame
    const HISTORY_SIZE = 6; // Mantener últimas 6 detecciones (3 segundos)
    const CONFIDENCE_THRESHOLD = 0.7; // 70% de las detecciones deben coincidir

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
              
              // Añadir a historial
              detectionHistory.push(faceCount > 1);
              if (detectionHistory.length > HISTORY_SIZE) {
                detectionHistory.shift();
              }
              
              // Solo cambiar estado si tenemos suficiente historial y confianza
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
        
        // Usar setInterval en lugar de requestAnimationFrame para mejor control
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

  const handleRetryDetection = () => {
    // Fuerza re-evaluación; el loop ya corre, pero limpiamos error
    setErrorCamara(null);
  };

  const handleVotar = (candidato) => {
    if (securityBlocked) {
      return; // Bloqueado por seguridad
    }
    setCandidatoSeleccionado(candidato);
    setModalOpen(true);
  };
  
  const confirmarVoto = () => {
    setVotoSeleccionado(candidatoSeleccionado.id);
    setModalOpen(false);
    alert(`Has votado por el candidato: ${candidatoSeleccionado.nombre}`);
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

      {/* Modal de confirmación */}
      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => { setVotoSeleccionado(candidatoSeleccionado.id); setModalOpen(false); alert(`Has votado por el candidato: ${candidatoSeleccionado.nombre}`); }}
        candidato={candidatoSeleccionado}
      />
    </div>
  );
};

export default Votacion;