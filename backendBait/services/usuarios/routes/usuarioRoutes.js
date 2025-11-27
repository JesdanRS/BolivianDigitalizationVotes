// services/usuarios/routes/usuarioRoutes.js
// Rutas para gestionar usuarios por rol: poblacion, jurados, administradores

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

/**
 * Rutas de usuarios agrupadas por rol
 * Estructura: /api/usuarios/:rol/*
 */

// Obtener usuarios por rol
router.get('/:rol', usuarioController.obtenerUsuariosPorRol);

// Obtener estadísticas por rol
router.get('/:rol/estadisticas', usuarioController.obtenerEstadisticas);

// Exportar usuarios a CSV por rol
router.get('/:rol/export', usuarioController.exportarUsuarios);

// Obtener usuario por carnet en un rol
router.get('/:rol/carnet/:carnet', usuarioController.obtenerPorCarnet);

// Obtener usuario por ID en un rol
router.get('/:rol/:id', usuarioController.obtenerUsuarioPorId);

// Crear usuario en un rol
router.post('/:rol', usuarioController.crearUsuario);

// Importar usuarios desde CSV en un rol
router.post('/:rol/import', usuarioController.importarCSV);

// Actualizar usuario
router.put('/:rol/:id', usuarioController.actualizarUsuario);

// Cambiar estado del usuario
router.patch('/:rol/:id/estado', usuarioController.cambiarEstadoUsuario);

// Marcar como votado
router.patch('/:rol/:id/votar', usuarioController.marcarComoVotado);

// Eliminar usuario
router.delete('/:rol/:id', usuarioController.eliminarUsuario);

module.exports = router;

// Eliminar usuario
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
