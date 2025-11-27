const mongoose = require('mongoose');

// Tu URI
const uri = "mongodb+srv://mamada:Votacion2024@back.2pwswmo.mongodb.net/Dig_elecciones?retryWrites=true&w=majority";

console.log('Intentando conectar a:', uri.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(uri)
    .then(() => {
        console.log('✅ ¡CONEXIÓN EXITOSA!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ ERROR DE CONEXIÓN:');
        console.error(err.message);
        console.error('Código:', err.code);
        console.error('Nombre:', err.name);
        process.exit(1);
    });
