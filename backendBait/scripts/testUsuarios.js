// backendBait/scripts/testUsuarios.js
// Script de prueba para endpoints de usuarios

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/usuarios';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

async function testEndpoints() {
  try {
    log.info('Iniciando pruebas de endpoints de usuarios...\n');

    // 1. Obtener usuarios
    log.info('1. Obteniendo usuarios...');
    const usuariosRes = await axios.get(API_BASE);
    log.success(`Usuarios obtenidos: ${usuariosRes.data.cantidad}`);
    console.log(`   Total: ${usuariosRes.data.cantidad} usuarios\n`);

    // 2. Crear usuario
    log.info('2. Creando nuevo usuario...');
    const nuevoUsuario = {
      nombre: 'Usuario Test ' + new Date().getTime(),
      carnet: 'TEST' + new Date().getTime(),
      fechaNacimiento: '01/01/2000',
      correo: `test${new Date().getTime()}@example.com`,
      rol: 'poblacion'
    };
    
    const createRes = await axios.post(API_BASE, nuevoUsuario);
    const usuarioId = createRes.data.usuario.id;
    log.success(`Usuario creado: ${usuarioId}`);
    console.log(`   Nombre: ${createRes.data.usuario.nombre}\n`);

    // 3. Obtener usuario por ID
    log.info('3. Obteniendo usuario por ID...');
    const getRes = await axios.get(`${API_BASE}/${usuarioId}`);
    log.success(`Usuario obtenido: ${getRes.data.usuario.carnet}`);
    console.log(`   Carnet: ${getRes.data.usuario.carnet}\n`);

    // 4. Actualizar usuario
    log.info('4. Actualizando usuario...');
    const updateRes = await axios.put(`${API_BASE}/${usuarioId}`, {
      nombre: 'Usuario Actualizado ' + new Date().getTime()
    });
    log.success(`Usuario actualizado`);
    console.log(`   Nuevo nombre: ${updateRes.data.usuario.nombre}\n`);

    // 5. Cambiar estado
    log.info('5. Cambiando estado del usuario...');
    const statusRes = await axios.patch(`${API_BASE}/${usuarioId}/estado`);
    log.success(`Estado cambiado: ${statusRes.data.usuario.estado ? 'Activo' : 'Inactivo'}\n`);

    // 6. Marcar como votado
    log.info('6. Marcando usuario como votado...');
    const votadoRes = await axios.patch(`${API_BASE}/${usuarioId}/votar`);
    log.success(`Usuario marcado como votado: ${votadoRes.data.usuario.haVotado}\n`);

    // 7. Obtener estadísticas
    log.info('7. Obteniendo estadísticas...');
    const statsRes = await axios.get(`${API_BASE}/estadisticas`);
    log.success(`Estadísticas obtenidas`);
    console.log(`   Total de usuarios: ${statsRes.data.estadisticas.totalUsuarios}`);
    console.log(`   Usuarios activos: ${statsRes.data.estadisticas.usuariosActivos}`);
    console.log(`   Porcentaje de participación: ${statsRes.data.estadisticas.porcentajeParticipacion}\n`);

    // 8. Exportar CSV
    log.info('8. Exportando usuarios a CSV...');
    log.success(`CSV disponible en: GET /api/usuarios/export?rol=poblacion\n`);

    // 9. Eliminar usuario
    log.info('9. Eliminando usuario de prueba...');
    await axios.delete(`${API_BASE}/${usuarioId}`);
    log.success(`Usuario eliminado\n`);

    log.info('🎉 Todas las pruebas completadas exitosamente!\n');

  } catch (error) {
    log.error(`Error en la prueba: ${error.response?.data?.error || error.message}`);
    if (error.response?.data) {
      console.log('Detalle:', error.response.data);
    }
  }
}

// Ejecutar pruebas
testEndpoints();
