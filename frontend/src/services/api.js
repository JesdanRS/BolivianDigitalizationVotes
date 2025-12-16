// api.js
// Configuración centralizada para llamadas al backend

// API Gateway URL - todos los requests pasan por aquí
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Realiza una petición HTTP al backend
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise<object>} - Respuesta del servidor
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // Para respuestas vacías (204 No Content o 200 sin body)
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Error en la petición");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

/**
 * Convierte fecha de DD/MM/AAAA a YYYY-MM-DD (formato LocalDate de Java)
 * @param {string} fecha - Fecha en formato DD/MM/AAAA
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
const convertirFecha = (fecha) => {
  if (!fecha) return null;
  const partes = fecha.split("/");
  if (partes.length !== 3) return fecha; // Si no tiene el formato esperado, devolver como está
  const [dia, mes, anio] = partes;
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

/**
 * Oculta parte del email para mostrar al usuario
 * @param {string} email - Email completo
 * @returns {string} - Email oculto (ej: j***@email.com)
 */
export const ocultarEmail = (email) => {
  if (!email) return "";
  const [usuario, dominio] = email.split("@");
  if (!dominio) return email;
  const usuarioOculto = usuario.charAt(0) + "***";
  return `${usuarioOculto}@${dominio}`;
};

// Endpoints específicos para autenticación de votantes
export const authAPI = {
  // Login: autentica con carnet + fechaNacimiento, envía código por email
  login: (carnet, fechaNacimiento) =>
    apiRequest("/api/usuarios/auth/login", {
      method: "POST",
      body: JSON.stringify({
        carnet,
        fechaNacimiento: convertirFecha(fechaNacimiento),
      }),
    }),

  // Verificar código de 6 dígitos
  verifyCode: (carnet, codigo) =>
    apiRequest(`/api/usuarios/${carnet}/verificar-codigo`, {
      method: "POST",
      body: JSON.stringify({ codigo }),
    }),

  // Reenviar código de verificación
  resendCode: (carnet) =>
    apiRequest(`/api/usuarios/${carnet}/solicitar-codigo`, {
      method: "POST",
    }),

  // Login para administradores/auditores/jurados
  adminLogin: (carnet, fechaNacimiento, correo, password) =>
    apiRequest("/api/usuarios/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({
        carnet,
        fechaNacimiento: convertirFecha(fechaNacimiento),
        correo,
        password,
      }),
    }),
};

export default apiRequest;
