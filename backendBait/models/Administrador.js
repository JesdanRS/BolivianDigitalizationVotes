// models/Administrador.js
// Modelo de Administrador para MongoDB usando Mongoose
// Colección: administradors

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const administradorSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  haVotado: {
    type: Boolean,
    default: false
  },
  estado: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'admin'
  }
}, {
  collection: 'administradors',
  timestamps: true
});

// Actualizar timestamps antes de guardar
// Actualizar timestamps y hashear password antes de guardar
administradorSchema.pre('save', async function (next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Índices para búsquedas rápidas
administradorSchema.index({ carnet: 1 });
administradorSchema.index({ correo: 1 });
administradorSchema.index({ estado: 1 });

// Método para convertir a DTO
administradorSchema.methods.toDTO = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    carnet: this.carnet,
    fechaNacimiento: this.fechaNacimiento,
    correo: this.correo,
    haVotado: this.haVotado,
    estado: this.estado,
    role: this.role
  };
};

// Método para marcar como votado
administradorSchema.methods.marcarComoVotado = function () {
  this.haVotado = true;
  return this.save();
};

// Método para cambiar estado
administradorSchema.methods.cambiarEstado = function (nuevoEstado) {
  this.estado = nuevoEstado;
  return this.save();
};

// Método para comparar contraseñas
administradorSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para comparar fecha de nacimiento
administradorSchema.methods.compararFechaNacimiento = function (fechaIngresada) {
  const fechaDB = this.fechaNacimiento.trim();
  const fechaInput = fechaIngresada.trim();
  return fechaDB === fechaInput;
};

// 🔥 Solución al OverwriteModelError
module.exports =
  mongoose.models.Administrador ||
  mongoose.model('Administrador', administradorSchema);
