// scripts/testearUsuarios.js
// Script para probar la API de usuarios por rol

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/usuarios';

// Colores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Roles a probar
const roles = ['poblacion', 'jurados', 'administradores'];

// Datos de prueba
const usuariosTest = {
  poblacion: {
    nombre: 'Juan Carlos Pérez',
    carnet: '13120200',
    fechaNacimiento: '08/06/2004',
    correo: 'juan.perez@example.com'
  },
  jurados: {
    nombre: 'María García López',
    carnet: '5678901',
    fechaNacimiento: '15/03/1985',
    correo: 'maria.garcia@example.com'
  },
  administradores: {
    nombre: 'Carlos Rodríguez',
    carnet: '9876543',
    fechaNacimiento: '22/11/1980',
    correo: 'carlos.rodriguez@example.com'
  }
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`)
};

const testearAPI = async () => {
  try {
    log.section('🚀 Iniciando pruebas de API de Usuarios');

    for (const rol of roles) {
      log.section(`📋 Probando ROL: ${rol.toUpperCase()}`);

      try {
        // 1. Crear usuario
        log.info(`Crear usuario en ${rol}...`);
        const crearResponse = await axios.post(
          `${API_BASE_URL}/${rol}`,
          usuariosTest[rol],
          { validateStatus: () => true }
        );

        let usuarioId;
        if (crearResponse.status === 201 || crearResponse.status === 200) {
          log.success(`Usuario creado exitosamente`);
          usuarioId = crearResponse.data.usuario.id;
          console.log(`   ID: ${usuarioId}`);
        } else {
          log.error(`Error al crear usuario: ${crearResponse.data.error}`);
          continue;
        }

        // 2. Obtener usuarios del rol
        log.info(`Obtener usuarios de ${rol}...`);
        const obtenerResponse = await axios.get(`${API_BASE_URL}/${rol}`, { validateStatus: () => true });

        if (obtenerResponse.status === 200) {
          log.success(`Usuarios obtenidos: ${obtenerResponse.data.cantidad}`);
        } else {
          log.error(`Error al obtener usuarios: ${obtenerResponse.data.error}`);
        }

        // 3. Obtener usuario por ID
        log.info(`Obtener usuario por ID...`);
        const obtenerIdResponse = await axios.get(
          `${API_BASE_URL}/${rol}/${usuarioId}`,
          { validateStatus: () => true }
        );

        if (obtenerIdResponse.status === 200) {
          log.success(`Usuario obtenido: ${obtenerIdResponse.data.usuario.nombre}`);
        } else {
          log.error(`Error: ${obtenerIdResponse.data.error}`);
        }

        // 4. Actualizar usuario
        log.info(`Actualizar usuario...`);
        const actualizarResponse = await axios.put(
          `${API_BASE_URL}/${rol}/${usuarioId}`,
          { correo: 'actualizado@example.com' },
          { validateStatus: () => true }
        );

        if (actualizarResponse.status === 200) {
          log.success(`Usuario actualizado`);
        } else {
          log.error(`Error: ${actualizarResponse.data.error}`);
        }

        // 5. Cambiar estado
        log.info(`Cambiar estado del usuario...`);
        const estadoResponse = await axios.patch(
          `${API_BASE_URL}/${rol}/${usuarioId}/estado`,
          { estado: false },
          { validateStatus: () => true }
        );

        if (estadoResponse.status === 200) {
          log.success(`Estado del usuario cambiado`);
        } else {
          log.error(`Error: ${estadoResponse.data.error}`);
        }

        // 6. Estadísticas
        log.info(`Obtener estadísticas...`);
        const estadisticasResponse = await axios.get(
          `${API_BASE_URL}/${rol}/estadisticas`,
          { validateStatus: () => true }
        );

        if (estadisticasResponse.status === 200) {
          const stats = estadisticasResponse.data.estadisticas;
          log.success(`Estadísticas obtenidas:`);
          console.log(`   - Total: ${stats.total}`);
          console.log(`   - Activos: ${stats.activos}`);
          console.log(`   - Han votado: ${stats.hanVotado}`);
        } else {
          log.error(`Error: ${estadisticasResponse.data.error}`);
        }

        // 7. Eliminar usuario
        log.info(`Eliminar usuario...`);
        const eliminarResponse = await axios.delete(
          `${API_BASE_URL}/${rol}/${usuarioId}`,
          { validateStatus: () => true }
        );

        if (eliminarResponse.status === 200) {
          log.success(`Usuario eliminado`);
        } else {
          log.error(`Error: ${eliminarResponse.data.error}`);
        }

      } catch (error) {
        log.error(`Error en pruebas de ${rol}: ${error.message}`);
      }
    }

    log.section('✨ Pruebas completadas');

  } catch (error) {
    log.error(`Error general: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar pruebas
testearAPI().then(() => {
  process.exit(0);
}).catch(err => {
  log.error(`Error fatal: ${err.message}`);
  process.exit(1);
});
