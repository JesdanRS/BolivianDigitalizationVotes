// models/Poblacion.js
// Modelo de Población para MongoDB usando Mongoose
// Colección: votantes

const mongoose = require('mongoose');

const poblacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [150, 'El nombre no puede exceder 150 caracteres']
  },
  carnet: {
    type: String,
    required: [true, 'El carnet es requerido'],
    unique: true,
    trim: true,
    minlength: [1, 'El carnet es requerido'],
    maxlength: [20, 'El carnet no puede exceder 20 caracteres']
  },
  fechaNacimiento: {
    type: String,
    required: [true, 'La fecha de nacimiento es requerida'],
    trim: true
    // Formato esperado: DD/MM/YYYY
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
  },
  haVotado: {
    type: Boolean,
    default: false
  },
  estado: {
    type: Boolean,
    default: true
  },
  rol: {
    type: String,
    default: 'poblacion'
  }
}, {
  collection: 'poblacion',
  timestamps: true
});

// Actualizar timestamps antes de guardar
poblacionSchema.pre('save', function(next) {
  next();
});

// Índices para búsquedas rápidas
poblacionSchema.index({ carnet: 1 });
poblacionSchema.index({ correo: 1 });
poblacionSchema.index({ estado: 1 });

// Método para convertir a DTO
poblacionSchema.methods.toDTO = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    carnet: this.carnet,
    fechaNacimiento: this.fechaNacimiento,
    correo: this.correo,
    haVotado: this.haVotado,
    estado: this.estado,
    rol: this.rol
  };
};

// Método para marcar como votado
poblacionSchema.methods.marcarComoVotado = function() {
  this.haVotado = true;
  return this.save();
};

// Método para cambiar estado
poblacionSchema.methods.cambiarEstado = function(nuevoEstado) {
  this.estado = nuevoEstado;
  return this.save();
};

module.exports = mongoose.model('Poblacion', poblacionSchema, 'votantes');
