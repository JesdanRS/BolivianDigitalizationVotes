// models/administradorModel.js
// Modelo de Mongoose para administradores, jurados y auditores

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const administradorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    carnet: {
      type: String,
      required: [true, "El carnet es obligatorio"],
      unique: true,
      trim: true,
      index: true,
    },
    fechaNacimiento: {
      type: String,
      required: [true, "La fecha de nacimiento es obligatoria"],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingrese un correo válido",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "auditor", "jurado"],
      default: "auditor",
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Método para encriptar contraseña antes de guardar
administradorSchema.pre("save", async function (next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified("password")) {
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

// Método para comparar contraseñas
administradorSchema.methods.compararPassword = async function (
  passwordIngresada
) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para comparar fecha de nacimiento
administradorSchema.methods.compararFechaNacimiento = function (
  fechaIngresada
) {
  const fechaDB = this.fechaNacimiento.trim();
  const fechaInput = fechaIngresada.trim();
  return fechaDB === fechaInput;
};

const Administrador = mongoose.model("Administrador", administradorSchema);

module.exports = Administrador;
