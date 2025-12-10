import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmailVerificationModal from "../components/common/EmailVerificationModal";
import {
  authenticateUser,
  saveUserData,
  verifyCode as verifyUserCode,
  resendVerificationCode,
} from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // Nuevo estado para el modal de ayuda
  const [carnet, setCarnet] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [emailOculto, setEmailOculto] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validar que los campos no estén vacíos
    if (!carnet || !fechaNacimiento) {
      setError("Por favor complete todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      // Autenticar usuario con backend
      const result = await authenticateUser(carnet, fechaNacimiento);

      if (result.success) {
        // Guardar email oculto para mostrar en el modal
        setEmailOculto(result.data.emailOculto);

        // Abrir modal de verificación
        setIsVerificationModalOpen(true);
      } else {
        setError(result.error || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    setIsLoading(true);

    try {
      // Verificar código con el backend
      const result = await verifyUserCode(carnet, code);

      if (result.success) {
        // Guardar datos del usuario y actualizar contexto
        saveUserData(result.user);
        login(result.user);

        // Cerrar modal
        setIsVerificationModalOpen(false);

        // Redirigir al usuario a la página de votación
        navigate("/votacion");
      } else {
        alert(
          result.error || "Código incorrecto. Por favor intente nuevamente."
        );
      }
    } catch (error) {
      console.error("Error al verificar código:", error);
      alert("Error al verificar el código. Por favor intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!carnet) {
      alert("Error: No se pudo reenviar el código");
      return;
    }

    setIsLoading(true);

    try {
      // Reenviar código usando el carnet
      const result = await resendVerificationCode(carnet);

      if (result.success) {
        alert(
          "Se ha enviado un nuevo código de verificación a " +
          result.emailOculto
        );
      } else {
        alert(result.error || "Error al reenviar el código");
      }
    } catch (error) {
      console.error("Error al reenviar código:", error);
      alert("Error al reenviar el código de verificación");
    } finally {
      setIsLoading(false);
    }
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
      {/* Contenido principal */}
      <div
        style={{
          padding: "40px",
          margin: "0",
          textAlign: "center",
          width: "100%",
          flex: "1",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "450px",
            width: "100%",
            padding: "30px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
            Iniciar Sesión
          </h1>
          <p style={{ color: "#666666", marginBottom: "25px" }}>
            Accede para ejercer tu derecho al voto.
          </p>

          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Carnet de Identidad"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              disabled={isLoading}
              style={{
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
              }}
            />

            <input
              type="text"
              placeholder="Fecha de Nacimiento (DD/MM/AAAA)"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              disabled={isLoading}
              style={{
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              {error && (
                <p style={{ color: "red", fontSize: "14px", marginBottom: 0 }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "12px",
                backgroundColor: isLoading ? "#999999" : "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: "10px",
              }}
            >
              {isLoading ? "Procesando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p
            style={{
              marginTop: "20px",
              fontSize: "14px",
              color: "#666666",
            }}
          >
            ¿Eres administrador o jurado?{" "}
            <Link
              to="/admin-login"
              style={{ color: "#dc2626", textDecoration: "none" }}
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      {/* Modal de verificación de correo */}
      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        email={emailOculto}
        isLoading={isLoading}
      />

      {/* Botón flotante de ayuda */}
      <button
        onClick={() => setIsHelpModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#dc2626", // Azul profesional
          color: "white",
          border: "none",
          fontSize: "24px",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="Guía de Votación"
      >
        ?
      </button>

      {/* Modal de Ayuda */}
      {isHelpModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
          onClick={() => setIsHelpModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              textAlign: "left",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsHelpModalOpen(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              ×
            </button>

            <h2
              style={{
                marginTop: 0,
                color: "#1e293b",
                fontSize: "1.5rem",
                borderBottom: "2px solid #e2e8f0",
                paddingBottom: "15px",
                marginBottom: "20px",
                textAlign: "center"
              }}
            >
              Guía Visual de Votación
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px"
            }}>
              {/* Paso 1 */}
              <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <img
                  src="/img/login_instruction_1765400829029.png"
                  alt="Inicio de Sesión"
                  style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px" }}
                />
                <h3 style={{ fontSize: "1rem", color: "#111827", margin: "5px 0" }}>1. Inicio de Sesión</h3>
                <p style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                  Ingrese su Carnet y Fecha de Nacimiento exactos.
                </p>
              </div>

              {/* Paso 2 */}
              <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <img
                  src="/img/face_id_instruction_1765400843644.png"
                  alt="Verificación Facial"
                  style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px" }}
                />
                <h3 style={{ fontSize: "1rem", color: "#111827", margin: "5px 0" }}>2. Verificación Facial</h3>
                <p style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                  <strong>Encienda su cámara</strong> y ubíquese en un lugar iluminado.
                </p>
              </div>

              {/* Paso 3 */}
              <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <img
                  src="/img/voting_instruction_1765400856126.png"
                  alt="Votación"
                  style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px" }}
                />
                <h3 style={{ fontSize: "1rem", color: "#111827", margin: "5px 0" }}>3. Emisión del Voto</h3>
                <p style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                  Seleccione sus candidatos. El voto es <strong>único y secreto</strong>.
                </p>
              </div>

              {/* Paso 4 */}
              <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <img
                  src="/img/success_vote_instruction_1765400879213.png"
                  alt="Confirmación"
                  style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px" }}
                />
                <h3 style={{ fontSize: "1rem", color: "#111827", margin: "5px 0" }}>4. Confirmación</h3>
                <p style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                  Revise su selección y confirme para finalizar el proceso.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "30px", textAlign: "right" }}>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
