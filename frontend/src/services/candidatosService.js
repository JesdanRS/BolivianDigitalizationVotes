import apiClient, { handleApiError } from './api';

/**
 * Servicio para gestión de candidatos
 * Base URL: /ms-candidatos/api/candidatos
 */

/**
 * Obtiene todos los candidatos
 * @returns {Promise<Array>} Lista de candidatos
 */
export const listarCandidatos = async () => {
    try {
        const response = await apiClient.get('/ms-candidatos/api/candidatos');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Obtiene un candidato por ID
 * @param {number} id - ID del candidato
 * @returns {Promise<Object>} Datos del candidato
 */
export const obtenerCandidato = async (id) => {
    try {
        const response = await apiClient.get(`/ms-candidatos/api/candidatos/${id}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Crea un nuevo candidato
 * @param {Object} candidatoData - Datos del candidato
 * @returns {Promise<Object>} Candidato creado
 */
export const crearCandidato = async (candidatoData) => {
    try {
        const response = await apiClient.post('/ms-candidatos/api/candidatos', candidatoData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Actualiza un candidato existente
 * @param {number} id - ID del candidato
 * @param {Object} candidatoData - Datos actualizados del candidato
 * @returns {Promise<Object>} Candidato actualizado
 */
export const actualizarCandidato = async (id, candidatoData) => {
    try {
        const response = await apiClient.put(`/ms-candidatos/api/candidatos/${id}`, candidatoData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Elimina un candidato
 * @param {number} id - ID del candidato
 * @param {string} ciUsuario - CI del usuario que ejecuta la acción
 * @returns {Promise<void>}
 */
export const eliminarCandidato = async (id, ciUsuario) => {
    try {
        await apiClient.delete(`/ms-candidatos/api/candidatos/${id}`, {
            data: { ciUsuario }
        });
    } catch (error) {
        throw handleApiError(error);
    }
};
