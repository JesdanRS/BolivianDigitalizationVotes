// api.js
// Configuración centralizada para llamadas al backend

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Realiza una petición HTTP al backend
 * @param {string} endpoint - Endpoint de la API (sin el prefijo /api)
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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en la petición");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Endpoints específicos para autenticación
export const authAPI = {
  login: (carnet, fechaNacimiento) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ carnet, fechaNacimiento }),
    }),

  verifyCode: (carnet, codigo) =>
    apiRequest("/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ carnet, codigo }),
    }),

  resendCode: (carnet) =>
    apiRequest("/auth/resend-code", {
      method: "POST",
      body: JSON.stringify({ carnet }),
    }),

  adminLogin: (carnet, fechaNacimiento, correo, password) =>
    apiRequest("/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ carnet, fechaNacimiento, correo, password }),
    }),
};

export default apiRequest;
