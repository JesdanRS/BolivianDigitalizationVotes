// conexion.js
// Configuración de conexión a MongoDB Atlas

require('dotenv').config();
const mongoose = require('mongoose');

// URL de conexión a MongoDB Atlas - Reemplaza con tu connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<db_user>:<db_password>@cluster0.gphzalx.mongodb.net/Dig_elecciones?retryWrites=true&w=majority';

// Opciones de configuración para la conexión
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

/**
 * Función para conectar a MongoDB Atlas
 * @returns {Promise} Promesa con la conexión
 */
const conectarDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, options);
        console.log('✅ Conexión exitosa a MongoDB Atlas - Base de datos: Dig_elecciones');

        // Listeners para eventos de conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB desconectado');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconectado');
        });

        return mongoose.connection;
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
        process.exit(1); // Salir si no se puede conectar
    }
};

/**
 * Función para cerrar la conexión a MongoDB
 */
const desconectarDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ Conexión a MongoDB cerrada correctamente');
    } catch (error) {
        console.error('❌ Error al cerrar la conexión:', error.message);
    }
};

// Exportar funciones y conexión
module.exports = {
    conectarDB,
    desconectarDB,
    connection: mongoose.connection
};
