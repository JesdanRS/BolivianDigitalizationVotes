// src/pages/MiVoto.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

// IMPORTANTE: servicio real de usuarios (backend /api/usuarios)
import { obtenerPerfil } from '../services/userService';

const getVoucherKey = (ci) => `comprobante_voto_${ci || 'anonimo'}`;

const MiVoto = () => {
  const { user } = useAuth();
  const [votanteData, setVotanteData] = useState(null);   // nombre + CI desde usuarios
  const [comprobante, setComprobante] = useState(null);   // fecha + método
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // 1) Leer comprobante de voto desde localStorage
      const carnet = user.carnet || user.ci || user.username || '';
      const voucherKey = getVoucherKey(carnet);
      const voucherStr = localStorage.getItem(voucherKey);

      if (!voucherStr) {
        // No hay comprobante -> nunca votó desde este front
        setLoading(false);
      } else {
        try {
          const voucher = JSON.parse(voucherStr);
          setComprobante(voucher);
        } catch (e) {
          console.error('Error al leer comprobante de voto:', e);
        }
      }

      // 2) Obtener datos del votante desde el BACKEND de usuarios
      //    Primero intentamos usar lo que ya viene en el objeto user
      let nombreCompleto =
        user.nombreCompleto ||
        user.nombre ||
        (user.nombres && user.apellidos
          ? `${user.nombres} ${user.apellidos}`
          : null);

      let cedulaIdentidad = user.carnet || user.ci || null;

      // Si falta algo, intentamos ir al endpoint /api/usuarios/perfil/{id}
      const posibleId =
        user.id || user.userId || user.idUsuario || user.idUsuarioSistema;

      if ((!nombreCompleto || !cedulaIdentidad) && posibleId) {
        try {
          const perfil = await obtenerPerfil(posibleId);

          nombreCompleto =
            perfil.nombreCompleto ||
            perfil.nombre ||
            (perfil.nombres && perfil.apellidos
              ? `${perfil.nombres} ${perfil.apellidos}`
              : nombreCompleto);

          cedulaIdentidad =
            perfil.carnet || perfil.ci || perfil.cedulaIdentidad || cedulaIdentidad;
        } catch (e) {
          console.error('Error obteniendo perfil de usuario:', e);
        }
      }

      setVotanteData({
        nombreCompleto: nombreCompleto || '-',
        cedulaIdentidad: cedulaIdentidad || carnet || '-',
      });

      setLoading(false);
    };

    cargarDatos();
  }, [user]);

  // 1) Carga inicial
  if (loading) {
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '20px',
          }}
        >
          <p>Cargando datos de su voto...</p>
        </div>
      </div>
    );
  }

  // 2) No hay comprobante -> no ha votado
  if (!comprobante) {
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
          <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Aún no has emitido tu voto</h1>
          <p style={{ maxWidth: 480, color: '#4b5563' }}>
            Para obtener tu carnet de sufragio digital primero debes emitir tu voto
            en la sección <strong>Mi Voto</strong>.
          </p>
        </div>
      </div>
    );
  }

  // 3) Sí hay comprobante -> mostrar carnet con nombre (de usuarios), CI, fecha y método
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
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '10px',
            fontWeight: 'bold',
          }}
        >
          Carnet de Sufragio Digital
        </h1>
        <p
          style={{
            color: '#666666',
            marginBottom: '25px',
            fontSize: '1rem',
          }}
        >
          Este es tu comprobante de votación. Guárdalo en un lugar seguro.
        </p>

        {/* Tarjeta con datos, fecha y método */}
        <div
          style={{
            maxWidth: 600,
            margin: '0 auto 30px',
            backgroundColor: '#f9fafb',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 25px rgba(15,23,42,0.18)',
            textAlign: 'left',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: 16,
              color: '#111827',
            }}
          >
            Datos del Votante
          </h2>

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginBottom: 4,
              }}
            >
              Nombre completo
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {votanteData?.nombreCompleto || '-'}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginBottom: 4,
              }}
            >
              Cédula de identidad
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {votanteData?.cedulaIdentidad || comprobante.carnet || '-'}
            </div>
          </div>

          <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />

          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: 16,
              color: '#111827',
            }}
          >
            Detalle del voto
          </h2>

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginBottom: 4,
              }}
            >
              Fecha y hora
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {comprobante.fechaLiteral ||
                new Date(comprobante.fechaIso).toLocaleString('es-BO')}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginBottom: 4,
              }}
            >
              Método de voto
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {comprobante.metodo || 'Voto electrónico'}
            </div>
          </div>
        </div>

        {/* Botón de descarga (placeholder) */}
        <button
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <span
            style={{
              marginRight: '8px',
              fontSize: '18px',
              lineHeight: '1',
            }}
          >
            ⬇
          </span>
          Descargar Carnet
        </button>
      </div>
    </div>
  );
};

export default MiVoto;