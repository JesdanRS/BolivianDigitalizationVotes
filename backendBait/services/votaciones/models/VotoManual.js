// models/VotoManual.js
// Modelo de datos para registro de votos manuales (imágenes físicas)

const mongoose = require("mongoose");

const votoManualSchema = new mongoose.Schema(
  {
    juradoId: {
      type: String, // Cambiado a String para permitir IDs temporales en demo
      default: "demo-jurado",
    },
    imagePath: {
      type: String,
      required: [true, "La ruta de la imagen es requerida"],
    },
    fileName: {
      type: String,
      required: [true, "El nombre del archivo es requerido"],
    },
    fileSize: {
      type: Number,
      required: [true, "El tamaño del archivo es requerido"],
    },
    mimeType: {
      type: String,
      required: [true, "El tipo MIME es requerido"],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    procesado: {
      type: Boolean,
      default: false,
    },
    notas: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "votos_manuales",
  }
);

// Índices para mejorar consultas
votoManualSchema.index({ juradoId: 1 });
votoManualSchema.index({ uploadDate: -1 });
votoManualSchema.index({ procesado: 1 });

const VotoManual = mongoose.model("VotoManual", votoManualSchema);

module.exports = VotoManual;
