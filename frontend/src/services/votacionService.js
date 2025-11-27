import apiClient, { handleApiError } from './api';

/**
 * Servicio para gestión de votaciones
 * Base URL: /api/votaciones
 */

/**
 * Crea una nueva votación (requiere rol ADMIN)
 * @param {Object} votacionData - Datos de la votación
 * @returns {Promise<Object>} Votación creada
 */
export const crearVotacion = async (votacionData) => {
    try {
        const response = await apiClient.post('/api/votaciones', votacionData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Obtiene una votación por ID
 * @param {number} id - ID de la votación
 * @returns {Promise<Object>} Datos de la votación
 */
export const obtenerVotacion = async (id) => {
    try {
        const response = await apiClient.get(`/api/votaciones/${id}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Lista todas las votaciones
 * @returns {Promise<Array>} Lista de votaciones
 */
export const listarVotaciones = async () => {
    try {
        const response = await apiClient.get('/api/votaciones');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Busca votaciones por localidad
 * @param {string} localidad - Nombre de la localidad
 * @returns {Promise<Array>} Lista de votaciones en la localidad
 */
export const buscarVotacionesPorLocalidad = async (localidad) => {
    try {
        const response = await apiClient.get(`/api/votaciones/localidad/${localidad}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};
