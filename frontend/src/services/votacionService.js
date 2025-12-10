// votacionService.js
// Servicio para interactuar con la API de votaciones

import apiRequest from './api.js';

/**
 * Obtener todos los candidatos activos
 */
export const obtenerCandidatos = async () => {
    try {
        const response = await apiRequest('/votaciones/candidatos', {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error al obtener candidatos:', error);
        throw error;
    }
};

/**
 * Registrar un voto para un candidato
 */
export const registrarVoto = async (candidatoId) => {
    try {
        const response = await apiRequest('/votaciones/votar', {
            method: 'POST',
            body: JSON.stringify({ candidatoId })
        });
        return response;
    } catch (error) {
        console.error('Error al registrar voto:', error);
        throw error;
    }
};

/**
 * Obtener resultados de votación
 */
export const obtenerResultados = async () => {
    try {
        const response = await apiRequest('/votaciones/resultados', {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        throw error;
    }
};

/**
 * Obtener estadísticas generales de votación
 */
export const obtenerEstadisticas = async () => {
    try {
        const response = await apiRequest('/votaciones/estadisticas', {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
};

/**
 * Crear un nuevo candidato
 */
export const crearCandidato = async (candidato) => {
    try {
        const response = await apiRequest('/votaciones/candidatos', {
            method: 'POST',
            body: JSON.stringify(candidato)
        });
        return response;
    } catch (error) {
        console.error('Error al crear candidato:', error);
        throw error;
    }
};

/**
 * Actualizar un candidato existente
 */
export const actualizarCandidato = async (id, candidato) => {
    try {
        const response = await apiRequest(`/votaciones/candidatos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(candidato)
        });
        return response;
    } catch (error) {
        console.error('Error al actualizar candidato:', error);
        throw error;
    }
};

/**
 * Eliminar un candidato
 */
export const eliminarCandidato = async (id) => {
    try {
        const response = await apiRequest(`/votaciones/candidatos/${id}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Error al eliminar candidato:', error);
        throw error;
    }
};

export default {
    obtenerCandidatos,
    registrarVoto,
    obtenerResultados,
    obtenerEstadisticas,
    crearCandidato,
    actualizarCandidato,
    eliminarCandidato
};
