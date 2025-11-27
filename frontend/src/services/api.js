import axios from 'axios';
import { getValidToken, clearToken } from './keycloakService';

// URL base del API Gateway
const API_BASE_URL = 'http://localhost:8080';

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
    if (error.response) {
        // El servidor respondió con un código de error
        return {
            message: error.response.data?.message || 'Error en la petición',
            status: error.response.status,
            data: error.response.data
        };
    } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        return {
            message: 'No se pudo conectar con el servidor. Verifica que los servicios estén ejecutándose.',
            status: 0
        };
    } else {
        // Algo pasó al configurar la petición
        return {
            message: error.message || 'Error desconocido',
            status: -1
        };
    }
};

export default apiClient;
