// services/usuarios/routes/usuarioRoutes.js
// Rutas para gestionar usuarios de la colección administradors

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

/**
 * Rutas de usuarios
 * Nota: :rol es un parámetro que se ignora, todos los usuarios vienen de la colección administradors
 */

// Obtener usuarios
router.get('/', usuarioController.obtenerUsuariosPorRol);
router.get('/:rol', usuarioController.obtenerUsuariosPorRol);

// Obtener estadísticas
router.get('/estadisticas', usuarioController.obtenerEstadisticas);
router.get('/:rol/estadisticas', usuarioController.obtenerEstadisticas);

// Exportar usuarios a CSV
router.get('/export', usuarioController.exportarUsuarios);
router.get('/:rol/export', usuarioController.exportarUsuarios);

// Obtener usuario por carnet
router.get('/carnet/:carnet', usuarioController.obtenerPorCarnet);
router.get('/:rol/carnet/:carnet', usuarioController.obtenerPorCarnet);

// Obtener usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.get('/:rol/:id', usuarioController.obtenerUsuarioPorId);

// Crear usuario
router.post('/', usuarioController.crearUsuario);
router.post('/:rol', usuarioController.crearUsuario);

// Importar usuarios desde CSV
router.post('/import', usuarioController.importarCSV);
router.post('/:rol/import', usuarioController.importarCSV);

// Actualizar usuario
router.put('/:id', usuarioController.actualizarUsuario);
router.put('/:rol/:id', usuarioController.actualizarUsuario);

// Cambiar estado del usuario
router.patch('/:id/estado', usuarioController.cambiarEstadoUsuario);
router.patch('/:rol/:id/estado', usuarioController.cambiarEstadoUsuario);

// Marcar como votado
router.patch('/:id/votar', usuarioController.marcarComoVotado);
router.patch('/:rol/:id/votar', usuarioController.marcarComoVotado);

// Eliminar usuario
router.delete('/:id', usuarioController.eliminarUsuario);
router.delete('/:rol/:id', usuarioController.eliminarUsuario);

module.exports = router;
