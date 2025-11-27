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

export default {
    obtenerCandidatos,
    registrarVoto,
    obtenerResultados,
    obtenerEstadisticas
};
