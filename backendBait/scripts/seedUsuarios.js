// scripts/seedUsuarios.js
// Script para insertar datos de prueba en las colecciones de usuarios

const mongoose = require('mongoose');
const { conectarDB, desconectarDB } = require('../conexion');
const Poblacion = require('../models/Poblacion');
const Jurado = require('../models/Jurado');
const Administrador = require('../models/Administrador');

// Datos de prueba
const usuariosPoblacion = [
  {
    nombre: 'Juan Carlos Pérez',
    carnet: '13120200',
    fechaNacimiento: '08/06/2004',
    correo: 'jesus.imana@ucb.edu.bo',
    haVotado: false,
    estado: true,
    rol: 'poblacion'
  },
  {
    nombre: 'María González López',
    carnet: '8765432',
    fechaNacimiento: '15/03/1990',
    correo: 'maria.gonzalez@example.com',
    haVotado: true,
    estado: true,
    rol: 'poblacion'
  },
  {
    nombre: 'Pedro Martínez Silva',
    carnet: '4567891',
    fechaNacimiento: '22/07/1988',
    correo: 'pedro.martinez@example.com',
    haVotado: false,
    estado: false,
    rol: 'poblacion'
  },
  {
    nombre: 'Ana Rodríguez García',
    carnet: '1234567',
    fechaNacimiento: '10/12/1995',
    correo: 'ana.rodriguez@example.com',
    haVotado: false,
    estado: true,
    rol: 'poblacion'
  },
  {
    nombre: 'Luis Fernández López',
    carnet: '9876543',
    fechaNacimiento: '05/01/1992',
    correo: 'luis.fernandez@example.com',
    haVotado: true,
    estado: true,
    rol: 'poblacion'
  }
];

const jurados = [
  {
    nombre: 'Jurado 1 - Carlos Hidalgo',
    carnet: 'J001',
    fechaNacimiento: '12/05/1970',
    correo: 'carlos.hidalgo@judicial.bo',
    haVotado: false,
    estado: true,
    rol: 'jurados'
  },
  {
    nombre: 'Jurado 2 - Rosa Morales',
    carnet: 'J002',
    fechaNacimiento: '20/08/1975',
    correo: 'rosa.morales@judicial.bo',
    haVotado: false,
    estado: true,
    rol: 'jurados'
  },
  {
    nombre: 'Jurado 3 - Jorge Ruiz',
    carnet: 'J003',
    fechaNacimiento: '15/03/1968',
    correo: 'jorge.ruiz@judicial.bo',
    haVotado: true,
    estado: true,
    rol: 'jurados'
  }
];

const administradores = [
  {
    nombre: 'Admin 1 - Diego Sánchez',
    carnet: 'A001',
    fechaNacimiento: '03/06/1985',
    correo: 'diego.sanchez@gobierno.bo',
    haVotado: false,
    estado: true,
    rol: 'administradores'
  },
  {
    nombre: 'Admin 2 - Valentina Cortés',
    carnet: 'A002',
    fechaNacimiento: '18/11/1987',
    correo: 'valentina.cortes@gobierno.bo',
    haVotado: false,
    estado: true,
    rol: 'administradores'
  }
];

const seedUsuarios = async () => {
  try {
    console.log('🌱 Iniciando seed de usuarios...\n');

    // Conectar a MongoDB
    await conectarDB();

    // Limpiar colecciones existentes
    console.log('🧹 Limpiando colecciones existentes...');
    await Poblacion.deleteMany({});
    await Jurado.deleteMany({});
    await Administrador.deleteMany({});
    console.log('✅ Colecciones limpiadas\n');

    // Insertar poblacion
    console.log('📝 Insertando pobladores...');
    const poblacionInsertada = await Poblacion.insertMany(usuariosPoblacion);
    console.log(`✅ ${poblacionInsertada.length} pobladores insertados\n`);

    // Insertar jurados
    console.log('📝 Insertando jurados...');
    const juradosInsertados = await Jurado.insertMany(jurados);
    console.log(`✅ ${juradosInsertados.length} jurados insertados\n`);

    // Insertar administradores
    console.log('📝 Insertando administradores...');
    const adminInsertados = await Administrador.insertMany(administradores);
    console.log(`✅ ${adminInsertados.length} administradores insertados\n`);

    // Mostrar resumen
    console.log('📊 Resumen de datos insertados:');
    console.log(`   - Pobladores: ${poblacionInsertada.length}`);
    console.log(`   - Jurados: ${juradosInsertados.length}`);
    console.log(`   - Administradores: ${adminInsertados.length}`);
    console.log(`   - Total: ${poblacionInsertada.length + juradosInsertados.length + adminInsertados.length}\n`);

    console.log('✨ Seed completado exitosamente!\n');

  } catch (error) {
    console.error('❌ Error al hacer seed:', error.message);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await desconectarDB();
    process.exit(0);
  }
};

// Ejecutar el seed
seedUsuarios();
