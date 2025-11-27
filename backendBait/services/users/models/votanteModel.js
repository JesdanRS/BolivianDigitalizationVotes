// models/votanteModel.js
// Modelo de Mongoose para la colección de votantes

const mongoose = require("mongoose");

const votanteSchema = new mongoose.Schema(
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
    haVotado: {
      type: Boolean,
      default: false,
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

// Método para comparar fecha de nacimiento (formato DD/MM/AAAA)
votanteSchema.methods.compararFechaNacimiento = function (fechaIngresada) {
  // Normalizar ambas fechas removiendo espacios
  const fechaDB = this.fechaNacimiento.trim();
  const fechaInput = fechaIngresada.trim();

  return fechaDB === fechaInput;
};

// Método para obtener email parcialmente oculto
votanteSchema.methods.getEmailOculto = function () {
  const email = this.correo;
  const [username, domain] = email.split("@");

  if (username.length <= 3) {
    return `${username[0]}***@${domain}`;
  }

  return `${username.substring(0, 2)}***@${domain}`;
};

const Votante = mongoose.model("Votante", votanteSchema);

module.exports = Votante;
