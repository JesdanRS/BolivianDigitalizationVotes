import axios from 'axios';
import { getValidToken, clearToken } from './keycloakService';

// Para desarrollo con proxy de Vite
const API_BASE_URL = ''; // o '/', las dos funcionan

// Crear instancia de axios configurada
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Interceptor de peticiones para añadir el token de autenticación
 */
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Obtener token válido (se refresca automáticamente si es necesario)
            const token = await getValidToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error al obtener token:', error);
            // Si no se puede obtener el token, continuar sin él
            // (algunos endpoints pueden ser públicos)
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor de respuestas para manejar errores de autenticación
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 (no autorizado) y no hemos reintentado ya
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intentar refrescar el token
                const token = await getValidToken();

                // Actualizar el header con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${token}`;

                // Reintentar la petición original
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, limpiar sesión y redirigir al login
                clearToken();

                // Puedes agregar aquí lógica para redirigir al login
                // Por ejemplo: window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Helper para manejar errores de API
 * @param {Error} error - Error de axios
 * @returns {Object} Objeto de error formateado
 */
export const handleApiError = (error) => {
  // Petición llegó al servidor y hay respuesta con status
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Intenta extraer un mensaje útil del backend
    let backendMessage = null;

    if (typeof data === 'string') {
      backendMessage = data; // por si devuelves un String plano (como en login)
    } else if (data?.message) {
      backendMessage = data.message;
    } else if (data?.detalle) {
      backendMessage = data.detalle;
    }

    const base = backendMessage ||
      (status === 401 ? 'No autorizado' :
       status === 403 ? 'Acceso denegado' :
       status === 500 ? 'Error interno del servidor' :
       'Error en la petición');

    return new Error(base);
  }

  // Petición nunca salió o no hubo respuesta
  if (error.request) {
    return new Error('No se recibió respuesta del servidor');
  }

  // Error al configurar la petición
  return new Error(error.message || 'Error desconocido');
};

export default apiClient;
