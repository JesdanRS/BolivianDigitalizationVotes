import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MiVoto = () => {
  const { user } = useAuth();
  const [votanteData, setVotanteData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const carnetRef = useRef(null);

  useEffect(() => {
    if (user && user.role === "usuario") {
      // Formatear datos del usuario para el carnet
      const formattedData = {
        nombreCompleto: user.nombre || "Usuario",
        cedulaIdentidad: user.carnet || "N/A",
        lugarVotacion: "Recinto Electoral Asignado",
        mesaSufragio: Math.floor(Math.random() * 100) + 1,
        fechaEmision: new Date().toLocaleDateString("es-BO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
      setVotanteData(formattedData);
    }
  }, [user]);

  // Función para descargar el carnet como PDF
  const handleDownloadPDF = async () => {
    if (!carnetRef.current) return;

    setIsDownloading(true);

    try {
      // Configurar html2canvas para mejor calidad
      const canvas = await html2canvas(carnetRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Crear PDF en orientación horizontal
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Calcular dimensiones para centrar la imagen en el PDF
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
      const y = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

      // Descargar el PDF
      const fileName = `Carnet_Sufragio_${
        votanteData?.cedulaIdentidad || "usuario"
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor intente nuevamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Renderizar un mensaje de carga si no hay datos de usuario aún
  if (!votanteData) {
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
          overflow: "hidden",
          backgroundColor: "#fff",
          color: "#000",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "20px",
          }}
        >
          <p>Cargando datos de su voto...</p>
        </div>
      </div>
    );
  }

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
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        color: "#000",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div
        style={{
          padding: "40px 20px",
          margin: "0",
          textAlign: "center",
          width: "100%",
          flex: "1",
          overflow: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "10px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Carnet de Sufragio Digital
        </h1>
        <p
          style={{
            color: "#666666",
            marginBottom: "30px",
            fontSize: "1rem",
          }}
        >
          Este es tu comprobante de votación. Guárdalo en un lugar seguro.
        </p>

        {/* Carnet de Sufragio Digital */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "30px",
          }}
        >
          <div
            ref={carnetRef}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "30px",
              width: "100%",
              maxWidth: "900px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              border: "2px solid #e0e0e0",
            }}
          >
            {/* Encabezado */}
            <div
              style={{
                borderBottom: "3px solid #dc2626",
                paddingBottom: "20px",
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "10px",
                }}
              >
                {/* Bandera de Bolivia */}
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #ccc",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "20px",
                      backgroundColor: "#D52B1E",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "30px",
                      height: "20px",
                      backgroundColor: "#F9E300",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "30px",
                      height: "20px",
                      backgroundColor: "#007934",
                    }}
                  ></div>
                </div>

                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    margin: 0,
                    color: "#1a1a1a",
                  }}
                >
                  REPÚBLICA DE BOLIVIA
                </h2>
              </div>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  margin: "5px 0",
                  fontWeight: "500",
                }}
              >
                Órgano Electoral Plurinacional
              </p>

              <div
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  display: "inline-block",
                  marginTop: "10px",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                }}
              >
                COMPROBANTE DE VOTACIÓN
              </div>
            </div>

            {/* Contenido del Carnet */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "25px",
                marginBottom: "25px",
              }}
            >
              {/* Columna Izquierda */}
              <div>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "15px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Nombre Completo
                  </p>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    {votanteData?.nombreCompleto || "-"}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "15px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Cédula de Identidad
                  </p>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    {votanteData?.cedulaIdentidad || "-"}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "20px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Mesa de Sufragio
                  </p>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#dc2626",
                      margin: 0,
                    }}
                  >
                    MESA Nº {votanteData?.mesaSufragio || "-"}
                  </p>
                </div>
              </div>

              {/* Columna Derecha */}
              <div>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "15px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Lugar de Votación
                  </p>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    {votanteData?.lugarVotacion || "-"}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "15px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Fecha de Votación
                  </p>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    {votanteData?.fechaEmision || "-"}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    padding: "20px",
                    border: "2px solid #4caf50",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#2e7d32",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Estado
                  </p>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#2e7d32",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>✓</span>
                    VOTO REGISTRADO
                  </p>
                </div>
              </div>
            </div>

            {/* Pie de página */}
            <div
              style={{
                borderTop: "2px solid #e0e0e0",
                paddingTop: "20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#999",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Este documento certifica que el ciudadano arriba mencionado ha
                ejercido su derecho al voto
                <br />
                en las elecciones realizadas en la fecha indicada, de acuerdo a
                la Constitución Política del Estado.
              </p>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#ccc",
                  marginTop: "10px",
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                }}
              >
                ID: {votanteData?.cedulaIdentidad}-{new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de descarga */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          style={{
            backgroundColor: isDownloading ? "#999" : "#dc2626",
            color: "white",
            padding: "14px 30px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isDownloading ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            transform: isDownloading ? "scale(0.98)" : "scale(1)",
          }}
          onMouseEnter={(e) => {
            if (!isDownloading) {
              e.target.style.backgroundColor = "#b91c1c";
              e.target.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDownloading) {
              e.target.style.backgroundColor = "#dc2626";
              e.target.style.transform = "scale(1)";
            }
          }}
        >
          <span
            style={{
              fontSize: "20px",
              lineHeight: "1",
            }}
          >
            {isDownloading ? "⏳" : "📥"}
          </span>
          {isDownloading ? "Generando PDF..." : "Descargar Carnet en PDF"}
        </button>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#666",
            marginTop: "15px",
          }}
        >
          El carnet se descargará en formato PDF
        </p>
      </div>
    </div>
  );
};

export default MiVoto;
