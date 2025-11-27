// models/Candidato.js
// Modelo de datos para Candidatos

const mongoose = require('mongoose');

const candidatoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del candidato es requerido'],
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true
    },
    partido: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String,
        default: 'default.png'
    },
    votos: {
        type: Number,
        default: 0,
        min: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'candidatos'
});

// Índices para mejorar el rendimiento
candidatoSchema.index({ nombre: 1 });
candidatoSchema.index({ activo: 1 });

// Método para incrementar votos
candidatoSchema.methods.incrementarVoto = async function () {
    this.votos += 1;
    return await this.save();
};

const Candidato = mongoose.model('Candidato', candidatoSchema);

module.exports = Candidato;
