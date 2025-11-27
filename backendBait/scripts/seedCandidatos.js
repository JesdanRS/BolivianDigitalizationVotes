// scripts/seedCandidatos.js
// Script para insertar datos iniciales de candidatos en MongoDB

const mongoose = require('mongoose');
const { conectarDB, desconectarDB } = require('../conexion');
const Candidato = require('../services/votaciones/models/Candidato');

// Datos de candidatos para insertar
const candidatosData = [
    {
        nombre: 'PDC',
        descripcion: 'Partido Demócrata Cristiano, de ideología centrista y humanista, promueve valores cristianos y justicia social.',
        partido: 'Partido Demócrata Cristiano',
        imagen: 'paz.png',
        votos: 0,
        activo: true
    },
    {
        nombre: 'Libre',
        descripcion: 'Partido Libertad y Refundación, de izquierda, impulsa reformas sociales, justicia económica y participación popular.',
        partido: 'Partido Libertad y Refundación',
        imagen: 'tuto.png',
        votos: 0,
        activo: true
    },
    {
        nombre: 'MAS',
        descripcion: 'Movimiento Al Socialismo, partido político de izquierda que promueve el socialismo del siglo XXI y los derechos indígenas.',
        partido: 'Movimiento Al Socialismo',
        imagen: 'mas.jpeg',
        votos: 0,
        activo: true
    },
    {
        nombre: 'CC',
        descripcion: 'Comunidad Ciudadana, partido de centro-derecha que busca modernizar Bolivia con políticas transparentes y democráticas.',
        partido: 'Comunidad Ciudadana',
        imagen: 'cc.jpg',
        votos: 0,
        activo: true
    },
    {
        nombre: 'Creemos',
        descripcion: 'Partido político de centro-derecha que promueve el desarrollo económico, la libertad individual y valores conservadores.',
        partido: 'Creemos',
        imagen: 'creemos.png',
        votos: 0,
        activo: true
    }
];

/**
 * Función principal para insertar candidatos
 */
const seedCandidatos = async () => {
    try {
        console.log('🌱 Iniciando seed de candidatos...\n');

        // Conectar a MongoDB
        await conectarDB();

        // Limpiar colección de candidatos existente (opcional)
        console.log('🧹 Limpiando candidatos existentes...');
        await Candidato.deleteMany({});
        console.log('✅ Candidatos eliminados\n');

        // Insertar nuevos candidatos
        console.log('📝 Insertando nuevos candidatos...');
        const candidatosInsertados = await Candidato.insertMany(candidatosData);

        console.log('✅ Candidatos insertados exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   Total de candidatos: ${candidatosInsertados.length}\n`);

        console.log('📋 Candidatos insertados:');
        candidatosInsertados.forEach((candidato, index) => {
            console.log(`   ${index + 1}. ${candidato.nombre} - ${candidato.partido}`);
            console.log(`      ID: ${candidato._id}`);
            console.log(`      Descripción: ${candidato.descripcion.substring(0, 50)}...`);
            console.log('');
        });

        console.log('✅ Seed completado exitosamente!\n');

    } catch (error) {
        console.error('❌ Error al hacer seed de candidatos:', error.message);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await desconectarDB();
        process.exit(0);
    }
};

// Ejecutar el seed
seedCandidatos();
