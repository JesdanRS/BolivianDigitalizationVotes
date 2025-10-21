// src/pages/Votacion.jsx

import React, { useState } from 'react';
import CandidatoCard from '../components/voting/CandidatoCard';
import Navbar from '../components/common/Navbar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import candidatoA from '../assets/images/paz.png';
import candidatoB from '../assets/images/tuto.png';

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

  const handleVotar = (candidato) => {
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
      
      {/* Modal de confirmación */}
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