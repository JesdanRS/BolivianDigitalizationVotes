import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminNavbar from "../../components/common/AdminNavbar";
import {
  getUsersByRole,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  procesarCSV,
  descargarPlantillaCSV,
  exportarUsuariosCSV,
} from "../../services/userService";

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

// Modal de Edición/Creación
const EditModal = ({ isOpen, onClose, onSave, usuario, rol }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    carnet: usuario?.carnet || "",
    nombre: usuario?.nombre || "",
    fechaNacimiento: usuario?.fechaNacimiento || "",
    correo: usuario?.correo || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.carnet || !formData.nombre || !formData.correo) {
      alert("Por favor completa todos los campos");
      return;
    }
    onSave(formData);
  };

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
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3
          style={{ marginBottom: "20px", fontSize: "1.25rem", fontWeight: 600 }}
        >
          {usuario ? "Editar Usuario" : "Nuevo Usuario"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#4b5563",
                fontWeight: 500,
              }}
            >
              Carnet *
            </label>
            <input
              type="text"
              value={formData.carnet}
              onChange={(e) =>
                setFormData({ ...formData, carnet: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "0.875rem",
              }}
              disabled={!!usuario}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#4b5563",
                fontWeight: 500,
              }}
            >
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "0.875rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#4b5563",
                fontWeight: 500,
              }}
            >
              Fecha de Nacimiento *
            </label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={formData.fechaNacimiento}
              onChange={(e) =>
                setFormData({ ...formData, fechaNacimiento: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "0.875rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              Correo *
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "0.875rem",
              }}
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <button
              type="button"
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
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#dc2626",
                color: "white",
                cursor: "pointer",
              }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para cargar CSV
const CSVUploadModal = ({ isOpen, onClose, rol, onSuccess }) => {
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCargando(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const contenido = event.target.result;
        const res = await procesarCSV(contenido, rol);
        setResultado(res);
        setCargando(false);
        if (res.exito && res.usuariosAgregados > 0) {
          setTimeout(() => {
            onSuccess();
            onClose();
            setResultado(null);
          }, 2000);
        }
      } catch (error) {
        setResultado({
          exito: false,
          errores: ["Error al procesar el archivo: " + error.message],
        });
        setCargando(false);
      }
    };

    reader.readAsText(file);
  };

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
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3
          style={{ marginBottom: "20px", fontSize: "1.25rem", fontWeight: 600 }}
        >
          Cargar Usuarios desde CSV
        </h3>

        {!resultado ? (
          <>
            <div
              style={{
                padding: "32px",
                border: "2px dashed #e5e7eb",
                borderRadius: "8px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={cargando}
                style={{ display: "none" }}
                id="csv-input"
              />
              <label
                htmlFor="csv-input"
                style={{
                  cursor: cargando ? "not-allowed" : "pointer",
                  display: "block",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📁</div>
                <div style={{ color: "#4b5563", marginBottom: "8px" }}>
                  {cargando
                    ? "Procesando..."
                    : "Haz clic o arrastra un archivo CSV"}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  Formato: Carnet, Nombre, Correo (sin encabezados o con
                  encabezados)
                </div>
              </label>
            </div>

            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                backgroundColor: "#fef3c7",
                borderRadius: "6px",
                fontSize: "0.875rem",
                color: "#92400e",
              }}
            >
              <strong>Formato esperado:</strong>
              <div style={{ marginTop: "8px", fontFamily: "monospace" }}>
                8812438,Juan Carlos Rojas,juan@example.com
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => descargarPlantillaCSV(rol)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  background: "white",
                  color: "#4b5563",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                📥 Descargar Plantilla
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  background: "white",
                  color: "#4b5563",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div>
            {resultado.exito ? (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#dcfce7",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  color: "#166534",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "8px" }}>
                  ✓ Carga exitosa
                </div>
                <div style={{ fontSize: "0.875rem" }}>
                  Se agregaron {resultado.usuariosAgregados} usuarios
                  correctamente.
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#fee2e2",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  color: "#991b1b",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "8px" }}>
                  ✗ Error en la carga
                </div>
              </div>
            )}

            {resultado.errores && resultado.errores.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  Errores encontrados:
                </div>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    fontSize: "0.75rem",
                    color: "#666",
                  }}
                >
                  {resultado.errores.map((error, idx) => {
                    const mensajeError =
                      typeof error === "string"
                        ? error
                        : `Fila ${error.fila}: ${error.razon}`;
                    return (
                      <div
                        key={idx}
                        style={{
                          marginBottom: "4px",
                          padding: "4px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "3px",
                        }}
                      >
                        {mensajeError}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setResultado(null);
                onClose();
              }}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#dc2626",
                color: "white",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente NavItem
const NavItem = ({ to, label, icon }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        backgroundColor: active ? "#eef2ff" : "transparent",
        color: active ? "#1f2937" : "#4b5563",
        textDecoration: "none",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {icon}
      {label}
    </Link>
  );
};

// Tabla de usuarios por rol
const TablaUsuarios = ({
  usuarios,
  rol,
  onEditar,
  onEliminar,
  onToggleStatus,
}) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              Carnet
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
              Nombre
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
              Correo
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
              Estado
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
          {usuarios.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "#9ca3af",
                }}
              >
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                style={{ borderBottom: "1px solid #e5e7eb" }}
              >
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "0.875rem",
                    color: "#111827",
                    fontFamily: "monospace",
                  }}
                >
                  {usuario.carnet}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "0.875rem",
                    color: "#111827",
                  }}
                >
                  {usuario.nombre}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  {usuario.correo}
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <button
                    onClick={() => onToggleStatus(usuario.id)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      border: "none",
                      background: usuario.estado ? "#dcfce7" : "#fee2e2",
                      color: usuario.estado ? "#166534" : "#991b1b",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {usuario.estado ? "✓ Activo" : "✗ Inactivo"}
                  </button>
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  <button
                    onClick={() => onEditar(usuario)}
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
                    onMouseOver={(e) => (e.target.style.background = "#fee2e2")}
                    onMouseOut={(e) => (e.target.style.background = "none")}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(usuario)}
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
                    onMouseOver={(e) => (e.target.style.background = "#fee2e2")}
                    onMouseOut={(e) => (e.target.style.background = "none")}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const GestionUsuarios = () => {
  const [rolActivo, setRolActivo] = useState("poblacion");
  const [usuarios, setUsuarios] = useState({
    jurados: [],
    administradores: [],
    poblacion: [],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios();
  }, [rolActivo]);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const nuevosUsuarios = {
        jurados: await getUsersByRole("jurados"),
        administradores: await getUsersByRole("administradores"),
        poblacion: await getUsersByRole("poblacion"),
      };
      setUsuarios(nuevosUsuarios);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      alert("Error al cargar usuarios");
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowEditModal(true);
  };

  const handleEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(usuarioSeleccionado.id, rolActivo);
      const nuevosUsuarios = {
        ...usuarios,
        [rolActivo]: usuarios[rolActivo].filter(
          (u) => u.id !== usuarioSeleccionado.id
        ),
      };
      setUsuarios(nuevosUsuarios);
      setShowDeleteModal(false);
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert("Error al eliminar usuario: " + error.message);
    }
  };

  const handleSaveEdit = async (formData) => {
    try {
      if (usuarioSeleccionado?.id) {
        await updateUser(usuarioSeleccionado.id, rolActivo, formData);
      } else {
        await createUser(rolActivo, formData);
      }

      // Recargar usuarios del rol actual
      const usuariosActualizados = await getUsersByRole(rolActivo);
      setUsuarios({
        ...usuarios,
        [rolActivo]: usuariosActualizados,
      });
      setShowEditModal(false);
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("Error al guardar usuario: " + error.message);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(id, rolActivo);
      const usuariosActualizados = await getUsersByRole(rolActivo);
      setUsuarios({
        ...usuarios,
        [rolActivo]: usuariosActualizados,
      });
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error al cambiar estado del usuario");
    }
  };

  const handleAnadirUsuario = () => {
    setUsuarioSeleccionado(null);
    setShowEditModal(true);
  };

  const handleCSVSuccess = async () => {
    try {
      const usuariosActualizados = await getUsersByRole(rolActivo);
      setUsuarios({
        ...usuarios,
        [rolActivo]: usuariosActualizados,
      });
    } catch (error) {
      console.error("Error recargando usuarios:", error);
    }
  };

  const etiquetasRol = {
    jurados: { label: "Jurados", icon: "👨‍⚖️" },
    administradores: { label: "Administradores", icon: "👨‍💼" },
    poblacion: { label: "Población", icon: "👥" },
  };

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
      <AdminNavbar />

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
          Gestionar Usuarios
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>
          Administra los usuarios del sistema por rol: Jurados, Administradores
          y Población.
        </p>

        {/* Pestañas de roles */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "12px",
          }}
        >
          {Object.entries(etiquetasRol).map(([rol, { label, icon }]) => (
            <button
              key={rol}
              onClick={() => setRolActivo(rol)}
              style={{
                padding: "10px 16px",
                borderRadius: "6px 6px 0 0",
                border: "none",
                background: rolActivo === rol ? "#dc2626" : "#f3f4f6",
                color: rolActivo === rol ? "white" : "#4b5563",
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (rolActivo !== rol) e.target.style.background = "#e5e7eb";
              }}
              onMouseOut={(e) => {
                if (rolActivo !== rol) e.target.style.background = "#f3f4f6";
              }}
            >
              <span>{icon}</span> {label} ({usuarios[rol]?.length || 0})
            </button>
          ))}
        </div>

        {/* Tabla de usuarios */}
        {cargando ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              padding: "40px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
            <div>Cargando usuarios...</div>
          </div>
        ) : (
          <TablaUsuarios
            usuarios={usuarios[rolActivo]}
            rol={rolActivo}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Botones de acción */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleAnadirUsuario}
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
            <span>+</span> Añadir Usuario
          </button>

          <button
            onClick={() => setShowCSVModal(true)}
            style={{
              background: "#1f2937",
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
            onMouseOver={(e) => (e.target.style.background = "#111827")}
            onMouseOut={(e) => (e.target.style.background = "#1f2937")}
          >
            📥 Cargar CSV
          </button>

          <button
            onClick={() => exportarUsuariosCSV(rolActivo)}
            style={{
              background: "#4b5563",
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
            onMouseOver={(e) => (e.target.style.background = "#374151")}
            onMouseOut={(e) => (e.target.style.background = "#4b5563")}
          >
            📥 Exportar CSV
          </button>
        </div>
      </div>

      {/* Modales */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro que deseas eliminar a ${usuarioSeleccionado?.nombre}? Esta acción no se puede deshacer.`}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        usuario={usuarioSeleccionado}
        rol={rolActivo}
      />

      <CSVUploadModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        rol={rolActivo}
        onSuccess={handleCSVSuccess}
      />
    </div>
  );
};

export default GestionUsuarios;
