// server.js
// Servidor principal del backend de votaciones

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { conectarDB } = require('./conexion');
const votacionRoutes = require('./services/votaciones/routes/votacionRoutes');
const usuarioRoutes = require('./services/usuarios/routes/usuarioRoutes');

// Crear app de Express
const app = express();

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet());

// CORS - Permitir peticiones desde el frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], // Ajusta según tu puerto del frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - Para leer JSON y texto plano
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));
app.use(express.urlencoded({ extended: true }));

// Logger de peticiones HTTP
app.use(morgan('dev'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: '🗳️ API de Votaciones - Sistema de Digitalización de Votos Bolivia',
        version: '1.0.0',
        endpoints: {
            usuarios: {
                listar: 'GET /api/usuarios',
                crear: 'POST /api/usuarios',
                actualizar: 'PUT /api/usuarios/:id',
                eliminar: 'DELETE /api/usuarios/:id',
                cambiarEstado: 'PATCH /api/usuarios/:id/estado',
                marcarVotado: 'PATCH /api/usuarios/:id/votar',
                importarCSV: 'POST /api/usuarios/bulk-import',
                exportar: 'GET /api/usuarios/export',
                estadisticas: 'GET /api/usuarios/estadisticas'
            },
            candidatos: '/api/votaciones/candidatos',
            votar: '/api/votaciones/votar',
            resultados: '/api/votaciones/resultados',
            estadisticas: '/api/votaciones/estadisticas'
        }
    });
});

// Rutas de votaciones
app.use('/api/votaciones', votacionRoutes);

// Rutas de usuarios
app.use('/api/usuarios', usuarioRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Función para iniciar el servidor
const iniciarServidor = async () => {
    try {
        // Conectar a MongoDB
        await conectarDB();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n${'='.repeat(50)}`);
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📋 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🗳️ API de Votaciones disponible`);
            console.log(`${'='.repeat(50)}\n`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
iniciarServidor();

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM recibido, cerrando servidor...');
    process.exit(0);
});

// process.on('SIGINT', () => {
//     console.log('\n🛑 SIGINT recibido, cerrando servidor...');
//     process.exit(0);
// });

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
});

module.exports = app;
