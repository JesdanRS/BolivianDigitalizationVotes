import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import {
  obtenerCandidatos,
  crearCandidato,
  actualizarCandidato,
  eliminarCandidato,
} from "../services/candidatoService";
import CandidateModal from "../components/candidatos/CandidateModal";
import AuditNavbar from "../components/common/AuditNavbar";

// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h3
          style={{ marginBottom: "16px", fontSize: "1.25rem", fontWeight: 600 }}
        >
          {title}
        </h3>
        <p style={{ marginBottom: "24px", color: "#4b5563" }}>{message}</p>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "white",
              color: "#4b5563",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: "#dc2626",
              color: "white",
              cursor: "pointer",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

const GestionCandidatos = () => {
  const { keycloak, initialized } = useKeycloak();
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState(null);

  // Cargar candidatos al inicio
  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
      cargarCandidatos();
    } else if (initialized) {
      setLoading(false);
    }
  }, [initialized, keycloak?.authenticated]);

  const cargarCandidatos = async () => {
    setLoading(true);
    try {
      const response = await obtenerCandidatos(keycloak.token);
      if (response.success) {
        setCandidatos(response.data);
      }
    } catch (error) {
      console.error("Error al cargar candidatos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id) => {
    const candidato = candidatos.find((c) => c.id === id);
    setSelectedCandidato(candidato);
    setShowEditModal(true);
  };

  const handleEliminar = (id) => {
    const candidato = candidatos.find((c) => c.id === id);
    setSelectedCandidato(candidato);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCandidato) {
      try {
        const response = await eliminarCandidato(
          selectedCandidato.id,
          keycloak.token
        );
        if (response.success) {
          cargarCandidatos();
          setShowDeleteModal(false);
          setSelectedCandidato(null);
        } else {
          alert("Error: " + (response.error || "No se pudo eliminar"));
        }
      } catch (error) {
        alert("Error al eliminar candidato");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      let response;
      if (selectedCandidato && selectedCandidato.id) {
        // Edición
        response = await actualizarCandidato(
          selectedCandidato.id,
          formData,
          keycloak.token
        );
      } else {
        // Creación
        response = await crearCandidato(formData, keycloak.token);
      }

      if (response.success) {
        cargarCandidatos();
        setShowEditModal(false);
        setSelectedCandidato(null);
      } else {
        alert("Error: " + (response.error || "Operación fallida"));
      }
    } catch (error) {
      alert("Error de red");
    }
  };

  const handleAnadirCandidato = () => {
    // Abrir modal de creación vacío
    setSelectedCandidato(null);
    setShowEditModal(true);
  };

  if (!initialized)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Cargando Keycloak...
      </div>
    );

  if (!keycloak?.authenticated) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Acceso Denegado</h2>
        <button
          onClick={() => keycloak.login()}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f9fafb",
        minHeight: "100dvh",
        color: "#111",
      }}
    >
      {/* Barra de navegación superior */}
      <AuditNavbar />

      {/* Contenido principal */}
      <div
        style={{
          padding: "24px 40px",
          width: "95%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 16 }}>
          Gestionar Candidatos
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>
          Añade, edita o elimina candidatos para las elecciones.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th
                  style={{
                    padding: "12px 24px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    fontWeight: 600,
                  }}
                >
                  Presidente
                </th>
                <th
                  style={{
                    padding: "12px 24px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    fontWeight: 600,
                  }}
                >
                  Vicepresidente
                </th>
                <th
                  style={{
                    padding: "12px 24px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    fontWeight: 600,
                  }}
                >
                  Partido
                </th>
                <th
                  style={{
                    padding: "12px 24px",
                    textAlign: "right",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    fontWeight: 600,
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {candidatos.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" style={{ padding: 24, textAlign: "center" }}>
                    No hay candidatos
                  </td>
                </tr>
              )}
              {candidatos.map((candidato) => (
                <tr
                  key={candidato.id}
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <td
                    style={{
                      padding: "16px 24px",
                      fontSize: "0.875rem",
                      color: "#111827",
                    }}
                  >
                    <strong>{candidato.nombreCompletoPresidente}</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      {candidato.carnetPresidente}
                    </small>
                  </td>
                  <td
                    style={{
                      padding: "16px 24px",
                      fontSize: "0.875rem",
                      color: "#111827",
                    }}
                  >
                    {candidato.nombreCompletoVicepresidente}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span
                      style={{
                        color: "#dc2626",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      {candidato.partido}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button
                      onClick={() => handleEditar(candidato.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        marginRight: "16px",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.background = "#fee2e2")
                      }
                      onMouseOut={(e) => (e.target.style.background = "none")}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(candidato.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.background = "#fee2e2")
                      }
                      onMouseOut={(e) => (e.target.style.background = "none")}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: "24px", borderTop: "1px solid #e5e7eb" }}>
            <button
              onClick={handleAnadirCandidato}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#b91c1c")}
              onMouseOut={(e) => (e.target.style.background = "#dc2626")}
            >
              <span>+</span> Añadir Candidato
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Candidato"
        message={`¿Estás seguro que deseas eliminar a ${selectedCandidato?.nombreCompletoPresidente}? Esta acción no se puede deshacer.`}
      />

      {showEditModal && (
        <CandidateModal
          candidate={selectedCandidato}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default GestionCandidatos;
