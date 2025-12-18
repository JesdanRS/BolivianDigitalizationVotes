import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

import { useKeycloak } from '@react-keycloak/web';

const JuradoEspera = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const { keycloak } = useKeycloak();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });

  const handleLogout = () => {
    logout();
    authLogout();
    navigate("/login");
  };

  // Validar archivo
  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Solo se aceptan imágenes JPG, JPEG o PNG",
      };
    }

    if (file.size > maxSize) {
      return { valid: false, error: "El archivo no debe superar 5MB" };
    }

    return { valid: true };
  };

  // Manejar selección de archivos
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  // Agregar archivos con validación
  const addFiles = (files) => {
    const validFiles = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          preview: URL.createObjectURL(file),
        });
      } else {
        setUploadStatus({ type: "error", message: validation.error });
        setTimeout(() => setUploadStatus({ type: "", message: "" }), 4000);
      }
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  // Eliminar archivo de la lista
  const removeFile = (id) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Convertir archivo a Base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  // Subir archivos al servidor
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus({
        type: "error",
        message: "Selecciona al menos una imagen",
      });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: "", message: "" });

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const fileObj of selectedFiles) {
        try {
          const base64Image = await toBase64(fileObj.file);

          const payload = {
            partido: "ACTA_DIGITALIZADA", // Valor por defecto
            candidato: "Carga Manual Jurado", // Valor por defecto
            localidad: "La Paz", // Se podría pedir al usuario
            fecha: new Date().toISOString(),
            actas: base64Image,
            carnetUsuario: user?.carnet || "0" // Carnet del jurado
          };

          const response = await fetch(
            "http://localhost:8080/api/votaciones",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${keycloak?.token}`
              },
              body: JSON.stringify(payload),
            }
          );

          if (response.ok) {
            successCount++;
            URL.revokeObjectURL(fileObj.preview);
          } else {
            console.error("Error response:", await response.text());
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error("Error al subir archivo:", error);
        }
      }

      if (successCount > 0) {
        setUploadStatus({
          type: "success",
          message: `${successCount} imagen(es) subida(s) exitosamente${errorCount > 0 ? `. ${errorCount} fallaron.` : ""
            }`,
        });
        setSelectedFiles([]);
      } else {
        setUploadStatus({
          type: "error",
          message: "Error al subir las imágenes. Intenta nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error general:", error);
      setUploadStatus({
        type: "error",
        message: "Error al procesar las imágenes",
      });
    } finally {
      setUploading(false);
    }
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        backgroundColor: "#f9fafb",
        color: "#111",
      }}
    >
      {/* Barra de navegación */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111" }}>
            VotoSeguro
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            · Jurado Electoral
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            {user?.nombre || "Jurado"}
          </span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#c7d2fe",
            }}
          />
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "5px 10px",
              borderRadius: "4px",
              border: "none",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "bold",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            padding: "32px",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            📸 Cargar Votos Manuales
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Sube imágenes de votos físicos para su digitalización y conteo
          </p>

          {/* Zona de drag and drop */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              border: isDragging ? "3px dashed #4f46e5" : "2px dashed #d1d5db",
              borderRadius: "12px",
              padding: "48px 24px",
              textAlign: "center",
              backgroundColor: isDragging ? "#eef2ff" : "#f9fafb",
              cursor: "pointer",
              transition: "all 0.3s",
              marginBottom: "24px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {isDragging ? "📥" : "🖼️"}
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111",
              }}
            >
              {isDragging
                ? "Suelta las imágenes aquí"
                : "Arrastra imágenes aquí"}
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                marginBottom: "12px",
              }}
            >
              o haz clic para seleccionar archivos
            </p>
            <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              JPG, JPEG o PNG · Máximo 5MB por archivo
            </p>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>

          {/* Mensajes de estado */}
          {uploadStatus.message && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                backgroundColor:
                  uploadStatus.type === "success" ? "#d1fae5" : "#fee2e2",
                color: uploadStatus.type === "success" ? "#065f46" : "#991b1b",
                border: `1px solid ${uploadStatus.type === "success" ? "#6ee7b7" : "#fca5a5"
                  }`,
                fontSize: "0.9rem",
              }}
            >
              {uploadStatus.message}
            </div>
          )}

          {/* Lista de archivos seleccionados */}
          {selectedFiles.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "#111",
                }}
              >
                Archivos seleccionados ({selectedFiles.length})
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {selectedFiles.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <img
                      src={fileObj.preview}
                      alt="Preview"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fileObj.file.name}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {formatFileSize(fileObj.file.size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileObj.id);
                      }}
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              style={{
                backgroundColor:
                  uploading || selectedFiles.length === 0
                    ? "#9ca3af"
                    : "#4f46e5",
                color: "white",
                padding: "12px 24px",
                borderRadius: "6px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  uploading || selectedFiles.length === 0
                    ? "not-allowed"
                    : "pointer",
                transition: "background 0.2s",
                opacity: uploading || selectedFiles.length === 0 ? 0.6 : 1,
              }}
            >
              {uploading
                ? "⏳ Subiendo..."
                : `📤 Subir ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""
                }`}
            </button>

            {selectedFiles.length > 0 && !uploading && (
              <button
                onClick={() => {
                  selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
                  setSelectedFiles([]);
                }}
                style={{
                  backgroundColor: "#fff",
                  color: "#6b7280",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                🗑️ Limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuradoEspera;
