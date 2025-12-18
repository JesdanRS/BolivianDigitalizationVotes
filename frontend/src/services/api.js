// api.js
// Configuración central de API para conectar con el API Gateway

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Función genérica para hacer peticiones a la API
 * @param {string} endpoint - El endpoint relativo (ej: /api/usuarios/login)
 * @param {object} options - Opciones de fetch (method, body, headers, etc)
 * @returns {Promise<any>} - La respuesta parseada como JSON
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    // Si la respuesta es 204 No Content, no intentar parsear JSON
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Convierte fecha de formato DD/MM/AAAA a YYYY-MM-DD (formato Java LocalDate)
 * @param {string} fecha - Fecha en formato DD/MM/AAAA
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
const convertirFecha = (fecha) => {
  if (!fecha) return fecha;
  // Si ya está en formato YYYY-MM-DD, devolverlo
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  // Convertir de DD/MM/AAAA a YYYY-MM-DD
  const partes = fecha.split("/");
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return fecha;
};

/**
 * Oculta parte del email para mostrar al usuario
 * @param {string} email - Email completo
 * @returns {string} - Email oculto (ej: j***@gmail.com)
 */
export const ocultarEmail = (email) => {
  if (!email || !email.includes("@")) return email;
  const [usuario, dominio] = email.split("@");
  const usuarioOculto = usuario.charAt(0) + "***";
  return `${usuarioOculto}@${dominio}`;
};

// API de autenticación
export const authAPI = {
  // Login combinado: autentica y envía código de verificación en un solo paso
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

  // Login para admin/auditor/jurado (si aplica)
  adminLogin: (carnet, fechaNacimiento, correo, password) =>
    apiRequest("/api/usuarios/admin/login", {
      method: "POST",
      body: JSON.stringify({
        carnet,
        fechaNacimiento: convertirFecha(fechaNacimiento),
        correo,
        password,
      }),
    }),

  // Obtener usuario por ID
  getUserById: (id) =>
    apiRequest(`/api/usuarios/${id}`, {
      method: "GET",
    }),

  // Obtener usuario por carnet
  getUserByCarnet: (carnet) =>
    apiRequest(`/api/usuarios/carnet/${carnet}`, {
      method: "GET",
    }),
};

export default apiRequest;
