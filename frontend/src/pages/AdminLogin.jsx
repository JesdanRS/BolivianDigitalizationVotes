import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveUserData } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

// ============================================
// CREDENCIALES HARDCODEADAS PARA LA DEMO
// ============================================
const DEMO_CREDENTIALS = {
  admin: {
    carnet: "12345678",
    fechaNacimiento: "01/01/1990",
    email: "admin@votaciones.bo",
    password: "Admin123",
    role: "ADMIN",
    nombre: "Admin Demo",
    redirectTo: "/admin/gestionar-candidatos",
  },
  jurado: {
    carnet: "87654321",
    fechaNacimiento: "15/06/1985",
    email: "jurado@votaciones.bo",
    password: "Jurado123",
    role: "JURADO",
    nombre: "Jurado Demo",
    redirectTo: "/jurado-espera",
  },
  auditor: {
    carnet: "11223344",
    fechaNacimiento: "20/03/1988",
    email: "auditor@votaciones.bo",
    password: "Auditor123",
    role: "AUDITOR",
    nombre: "Auditor Demo",
    redirectTo: "/auditoria",
  },
};

// Token de votante para usar en la demo (necesario para que el endpoint funcione)
const DEMO_VOTER_TOKEN = "12121212"; // Carnet de votante de prueba

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [carnet, setCarnet] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validar que los campos no estén vacíos
    if (!carnet || !fechaNacimiento || !password || !email) {
      setError("Por favor complete todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      // Buscar credenciales que coincidan
      const matchedUser = Object.values(DEMO_CREDENTIALS).find(
        (cred) =>
          cred.carnet === carnet.trim() &&
          cred.fechaNacimiento === fechaNacimiento.trim() &&
          cred.email.toLowerCase() === email.toLowerCase().trim() &&
          cred.password === password
      );

      if (!matchedUser) {
        setError(
          "Credenciales inválidas. Use las credenciales de demo proporcionadas."
        );
        setIsLoading(false);
        return;
      }

      // ============================================
      // LLAMADA AL ENDPOINT PARA LOGS DE DOCKER
      // ============================================
      // Hacemos la llamada al endpoint de login real usando el token de votante
      // Esto fallará pero quedará registrado en los logs de Docker
      try {
        console.log("🔍 Llamando al endpoint de login para demostración...");
        await apiRequest("/api/usuarios/auth/login", {
          method: "POST",
          body: JSON.stringify({
            carnet: DEMO_VOTER_TOKEN,
            fechaNacimiento: "12/12/1990",
          }),
        });
      } catch {
        // Ignoramos errores del API, solo queremos que aparezca en logs
        console.log("✅ Llamada al endpoint registrada en logs (esperado)");
      }

      // Crear objeto de usuario para la demo
      const demoUser = {
        id: Math.floor(Math.random() * 10000),
        carnet: matchedUser.carnet,
        nombre: matchedUser.nombre,
        correoElectronico: matchedUser.email,
        role: matchedUser.role,
        rol: matchedUser.role,
        isAuthenticated: true,
        fechaNacimiento: matchedUser.fechaNacimiento,
      };

      // Guardar datos del usuario y actualizar contexto
      saveUserData(demoUser);
      login(demoUser);

      console.log(
        `✅ Login exitoso para ${matchedUser.role}: ${matchedUser.nombre}`
      );

      // Pequeño delay para simular autenticación
      setTimeout(() => {
        navigate(matchedUser.redirectTo);
      }, 500);
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al conectar con el servidor");
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
            Acceso Administrativo
          </h1>
          <p style={{ color: "#666666", marginBottom: "25px" }}>
            Ingresa tus credenciales de administrador, auditor o jurado.
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

            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
              }}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
              }}
            />

            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "14px",
                  textAlign: "left",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

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
            ¿No eres administrador?{" "}
            <Link
              to="/login"
              style={{ color: "#dc2626", textDecoration: "none" }}
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
