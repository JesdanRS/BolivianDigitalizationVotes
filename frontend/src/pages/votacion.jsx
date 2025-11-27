// src/pages/Votacion.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import CandidatoCard from '../components/voting/CandidatoCard';
import Navbar from '../components/common/Navbar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SecurityModal from '../components/common/SecurityModal';

// Imágenes locales solo como fallback si falla backend o no trae foto
import candidatoA from '../assets/images/paz.png';
import candidatoB from '../assets/images/tuto.png';

import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

import { listarCandidatos } from '../services/candidatosService';
import { emitirVoto } from '../services/votacionService';

// Fallback local por si backend de candidatos falla
const candidatosFallback = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    partido: 'PDC',
    descripcion: 'PDC',
    imagen: candidatoA,
  },
  {
    id: 2,
    nombre: 'Juan Pérez',
    partido: 'LIBRE',
    descripcion: 'LIBRE',
    imagen: candidatoB,
  },
];

// Normaliza objeto de candidato que viene del backend a lo que la UI necesita
const mapearCandidatoBackend = (c) => {
  const partido =
    c.partido ??
    c.nombrePartido ??
    c.sigla ??
    'PARTIDO_DESCONOCIDO';

  const nombreCandidato =
    c.nombre ??
    c.nombreCompletoPresidente ??
    c.candidato ??
    partido;

  const descripcion = partido;
  const imagen = c.imagenUrl ?? c.fotoUrl ?? undefined;

  return {
    id: c.id ?? c.ci ?? partido,
    nombre: nombreCandidato,
    descripcion,
    imagen,
    partido,
  };
};

// Paleta de colores para diferenciar tarjetas de candidatos
const CARD_COLORS = ['#dbeafe', '#fee2e2', '#dcfce7', '#fef3c7', '#f5f3ff', '#e0f2fe'];
const PERSON_COLORS = ['#1d4ed8', '#b91c1c', '#16a34a', '#d97706', '#7c3aed', '#0f766e'];

const getVoteFlagKey = (ci) => `voto_emitido_${ci || 'anonimo'}`;
const getVoucherKey = (ci) => `comprobante_voto_${ci || 'anonimo'}`;

const Votacion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [candidatos, setCandidatos] = useState([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(true);
  const [errorCandidatos, setErrorCandidatos] = useState('');

  const [votoSeleccionado, setVotoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [securityBlocked, setSecurityBlocked] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);
  const [yaVoto, setYaVoto] = useState(false);

  const videoRef = useRef(null);

  // ===================== CARGA DE CANDIDATOS DESDE BACKEND =====================
  useEffect(() => {
    (async () => {
      try {
        const data = await listarCandidatos();
        if (Array.isArray(data) && data.length > 0) {
          const mapeados = data.map(mapearCandidatoBackend);
          setCandidatos(mapeados);
          setErrorCandidatos('');
        } else {
          setCandidatos(candidatosFallback);
          setErrorCandidatos(
            'No se encontraron candidatos en el backend, usando datos de ejemplo.'
          );
        }
      } catch (e) {
        console.error('Error cargando candidatos:', e);
        setCandidatos(candidatosFallback);
        setErrorCandidatos(
          'No se pudo cargar la lista de candidatos, usando datos de ejemplo.'
        );
      } finally {
        setLoadingCandidatos(false);
      }
    })();
  }, []);

  // ===================== REVISAR SI EL USUARIO YA VOTÓ =====================
  useEffect(() => {
    if (!user?.carnet) return;
    const key = getVoteFlagKey(user.carnet);
    const flag = localStorage.getItem(key);
    if (flag === '1') {
      setYaVoto(true);
    }
  }, [user]);

  // ===================== CÁMARA + DETECCIÓN DE MÚLTIPLES ROSTROS =====================
  useEffect(() => {
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
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraActive(true);
        setErrorCamara(null);

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
                } else if (confidence <= 1 - CONFIDENCE_THRESHOLD) {
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
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleRetryDetection = () => {
    setErrorCamara(null);
  };

  // ===================== LÓGICA DE VOTO =====================

  const handleVotar = (candidato) => {
    if (securityBlocked || yaVoto) return;
    setCandidatoSeleccionado(candidato);
    setModalOpen(true);
  };

  const construirPayloadVoto = (c) => {
    if (c && c.esBlanco) {
      return {
        partido: 'VOTO_BLANCO',
        candidato: 'Voto en blanco',
        localidad: 'La Paz',
      };
    }

    const partido =
      c.partido ??
      c.nombrePartido ??
      c.sigla ??
      'PARTIDO_DESCONOCIDO';

    const nombreCandidato =
      c.nombre ??
      c.nombreCompletoPresidente ??
      c.candidato ??
      'CANDIDATO_DESCONOCIDO';

    return {
      partido,
      candidato: nombreCandidato,
      localidad: 'La Paz',
    };
  };

  const confirmarVoto = async () => {
    if (!candidatoSeleccionado) return;

    setModalOpen(false);

    try {
      const payload = construirPayloadVoto(candidatoSeleccionado);
      await emitirVoto(payload);

      setVotoSeleccionado(candidatoSeleccionado.id);

      // Marcar que el usuario ya votó y guardar comprobante
      if (user?.carnet) {
        const flagKey = getVoteFlagKey(user.carnet);
        const voucherKey = getVoucherKey(user.carnet);

        localStorage.setItem(flagKey, '1');

        const ahora = new Date();
        const metodoVoto = candidatoSeleccionado.esBlanco
          ? 'Voto en blanco'
          : 'Voto electrónico';

        const comprobante = {
          carnet: user.carnet,
          // Si luego quieres, puedes agregar más datos aquí
          fechaIso: ahora.toISOString(),
          fechaLiteral: ahora.toLocaleString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          metodo: metodoVoto,
          candidato: candidatoSeleccionado.esBlanco ? null : candidatoSeleccionado.nombre,
          partido: candidatoSeleccionado.esBlanco ? null : (candidatoSeleccionado.partido || payload.partido),
        };

        localStorage.setItem(voucherKey, JSON.stringify(comprobante));
        setYaVoto(true);
      }

      const nombreParaMensaje = candidatoSeleccionado.esBlanco
        ? 'Voto en blanco'
        : candidatoSeleccionado.nombre;

      alert(`Has votado por: ${nombreParaMensaje}`);

      // Redirigir a Registro Voto (ajusta la ruta si es otra)
      navigate('/registro-voto');
    } catch (e) {
      console.error('Error al registrar voto:', e);
      alert('Ocurrió un error al registrar tu voto. Intenta nuevamente.');
    }
  };

  // Candidatos + voto en blanco
  const opciones = [
    ...candidatos,
    {
      id: 'VOTO_BLANCO',
      nombre: 'Voto en Blanco',
      descripcion: 'VOTO_BLANCO',
      imagen: undefined,
      partido: 'VOTO_BLANCO',
      esBlanco: true,
    },
  ];

  // ===================== BLOQUEO SI YA VOTÓ =====================
  if (yaVoto) {
    return (
      <div
        style={{
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
          bottom: 0,
        }}
      >
        <Navbar />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Ya has emitido tu voto</h1>
          <p style={{ maxWidth: 480, color: '#4b5563', marginBottom: 24 }}>
            Según nuestros registros, ya realizaste tu votación. Si deseas, puedes
            revisar tu carnet de sufragio digital en la sección <strong>Registro Voto</strong>.
          </p>
          <button
            onClick={() => navigate('/registro-voto')}
            style={{
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '10px 24px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Ir a Registro Voto
          </button>
        </div>
      </div>
    );
  }

  // ===================== VISTA NORMAL DE VOTACIÓN =====================
  return (
    <div
      style={{
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
        bottom: 0,
      }}
    >
      <Navbar />

      <div
        style={{
          padding: '40px',
          margin: '0',
          textAlign: 'center',
          width: '100%',
          flex: '1',
          overflow: 'auto',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Elige tu Candidato</h1>
        <p style={{ color: '#000000', marginBottom: '16px' }}>
          Selecciona el candidato que mejor represente tus ideales para las elecciones en Bolivia.
        </p>

        {errorCandidatos && (
          <p style={{ color: '#b91c1c', marginBottom: '16px', fontSize: '0.9rem' }}>
            {errorCandidatos}
          </p>
        )}

        {loadingCandidatos ? (
          <p>Cargando candidatos...</p>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              padding: '0',
              width: '100%',
            }}
          >
            {opciones.map((candidato, index) => {
              const isBlank = candidato.esBlanco;
              const accentColor = isBlank
                ? '#f3f4f6'
                : CARD_COLORS[index % CARD_COLORS.length];
              const personColor = isBlank
                ? '#111827'
                : PERSON_COLORS[index % PERSON_COLORS.length];

              return (
                <CandidatoCard
                  key={candidato.id}
                  nombre={candidato.nombre}
                  descripcion={
                    isBlank
                      ? 'Voto en blanco (sin elegir ningún candidato).'
                      : candidato.partido || candidato.descripcion
                  }
                  imagen={candidato.imagen}
                  accentColor={accentColor}
                  personColor={personColor}
                  isBlank={isBlank}
                  onVotar={() => handleVotar(candidato)}
                />
              );
            })}
          </div>
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'fixed',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <SecurityModal
        isOpen={securityBlocked || !cameraActive}
        cameraActive={cameraActive}
        multipleFacesDetected={securityBlocked}
        onRetry={handleRetryDetection}
      />

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
