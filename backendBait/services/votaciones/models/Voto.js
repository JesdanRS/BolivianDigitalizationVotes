// models/Voto.js
// Modelo de datos para registro de votos

const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
    candidatoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidato',
        required: [true, 'El ID del candidato es requerido']
    },
    candidatoNombre: {
        type: String,
        required: true
    },
    usuarioId: {
        type: String,
        default: 'anonimo' // Por defecto si no hay autenticación
    },
    ipAddress: {
        type: String,
        default: 'unknown'
    },
    userAgent: {
        type: String,
        default: 'unknown'
    },
    fechaVoto: {
        type: Date,
        default: Date.now
    },
    validado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'votos'
});

// Índices para mejorar consultas
votoSchema.index({ candidatoId: 1 });
votoSchema.index({ fechaVoto: -1 });
votoSchema.index({ usuarioId: 1 });

const Voto = mongoose.model('Voto', votoSchema);

module.exports = Voto;
