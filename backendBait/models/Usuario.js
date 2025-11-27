// models/Usuario.js
// Modelo de Usuario para MongoDB usando Mongoose

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
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
  rol: {
    type: String,
    enum: ['jurados', 'administradores', 'poblacion'],
    default: 'poblacion'
  },
  estado: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'votantes',
  timestamps: true
});

// Actualizar fechaActualizacion antes de guardar
usuarioSchema.pre('save', function(next) {
  this.fechaActualizacion = new Date();
  next();
});

// Índices para búsquedas rápidas
usuarioSchema.index({ carnet: 1 });
usuarioSchema.index({ correo: 1 });
usuarioSchema.index({ rol: 1 });
usuarioSchema.index({ estado: 1 });

// Método para convertir a DTO
usuarioSchema.methods.toDTO = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    carnet: this.carnet,
    fechaNacimiento: this.fechaNacimiento,
    correo: this.correo,
    haVotado: this.haVotado,
    rol: this.rol,
    estado: this.estado,
    fechaCreacion: this.fechaCreacion,
    fechaActualizacion: this.fechaActualizacion
  };
};

// Método para marcar como votado
usuarioSchema.methods.marcarComoVotado = function() {
  this.haVotado = true;
  return this.save();
};

// Método para cambiar estado
usuarioSchema.methods.cambiarEstado = function(nuevoEstado) {
  this.estado = nuevoEstado;
  return this.save();
};

module.exports = mongoose.model('Usuario', usuarioSchema);
