// routes/votacionRoutes.js
// Rutas para el servicio de votaciones

const express = require('express');
const router = express.Router();
const {
    obtenerCandidatos,
    obtenerCandidatoPorId,
    registrarVoto,
    obtenerResultados,
    obtenerEstadisticas,
    verificarEstadoVotacion
} = require('../controllers/votacionController');

/**
 * @route   GET /api/votaciones/candidatos
 * @desc    Obtener todos los candidatos activos
 * @access  Public
 */
router.get('/candidatos', obtenerCandidatos);

/**
 * @route   GET /api/votaciones/candidatos/:id
 * @desc    Obtener un candidato específico por ID
 * @access  Public
 */
router.get('/candidatos/:id', obtenerCandidatoPorId);

/**
 * @route   POST /api/votaciones/votar
 * @desc    Registrar un voto para un candidato
 * @access  Public
 */
router.post('/votar', registrarVoto);

/**
 * @route   GET /api/votaciones/resultados
 * @desc    Obtener resultados de la votación
 * @access  Public
 */
router.get('/resultados', obtenerResultados);

/**
 * @route   GET /api/votaciones/estadisticas
 * @desc    Obtener estadísticas generales de votación
 * @access  Public
 */
router.get('/estadisticas', obtenerEstadisticas);

/**
 * @route   GET /api/votaciones/verificar/:votanteId
 * @desc    Verificar si un votante ya ha votado
 * @access  Public
 */
router.get('/verificar/:votanteId', verificarEstadoVotacion);

module.exports = router;
