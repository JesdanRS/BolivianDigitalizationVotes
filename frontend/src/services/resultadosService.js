import apiClient, { handleApiError } from './api';

/**
 * Servicio para gestión de resultados y estadísticas
 * Base URL: /api/resultados/resultados
 */

/**
 * Lista todos los resultados electorales
 * @returns {Promise<Array>} Lista de resultados
 */
export const listarResultados = async () => {
    try {
        const response = await apiClient.get('/api/resultados/resultados');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Obtiene un resultado por ID
 * @param {number} id - ID del resultado
 * @returns {Promise<Object>} Datos del resultado
 */
export const obtenerResultado = async (id) => {
    try {
        const response = await apiClient.get(`/api/resultados/resultados/${id}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Lista resultados por departamento
 * @param {string} departamento - Nombre del departamento
 * @returns {Promise<Array>} Lista de resultados del departamento
 */
export const listarResultadosPorDepartamento = async (departamento) => {
    try {
        const response = await apiClient.get(`/api/resultados/resultados/departamento/${departamento}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Lista resultados por municipio
 * @param {string} municipio - Nombre del municipio
 * @returns {Promise<Array>} Lista de resultados del municipio
 */
export const listarResultadosPorMunicipio = async (municipio) => {
    try {
        const response = await apiClient.get(`/api/resultados/resultados/municipio/${municipio}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Crea un nuevo resultado electoral
 * @param {Object} resultadoData - Datos del resultado
 * @returns {Promise<Object>} Resultado creado
 */
export const crearResultado = async (resultadoData) => {
    try {
        const response = await apiClient.post('/api/resultados/resultados', resultadoData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Actualiza un resultado existente
 * @param {number} id - ID del resultado
 * @param {Object} resultadoData - Datos actualizados del resultado
 * @returns {Promise<Object>} Resultado actualizado
 */
export const actualizarResultado = async (id, resultadoData) => {
    try {
        const response = await apiClient.put(`/api/resultados/resultados/${id}`, resultadoData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Elimina un resultado
 * @param {number} id - ID del resultado
 * @returns {Promise<void>}
 */
export const eliminarResultado = async (id) => {
    try {
        await apiClient.delete(`/api/resultados/resultados/${id}`);
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Obtiene estadísticas por departamento
 * @returns {Promise<Array>} Lista de estadísticas
 */
export const obtenerEstadisticas = async () => {
    try {
        const response = await apiClient.get('/api/resultados/resultados/estadisticas');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Obtiene estadística de un departamento específico
 * @param {string} departamento - Nombre del departamento
 * @returns {Promise<Object>} Estadística del departamento
 */
export const obtenerEstadisticaDepartamento = async (departamento) => {
    try {
        const response = await apiClient.get(`/api/resultados/resultados/estadisticas/${departamento}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};
