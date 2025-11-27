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
    </div>
  );
};

export default Login;
