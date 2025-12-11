// controllers/votoManualController.js
// Controlador para la gestión de votos manuales (imágenes físicas)

const VotoManual = require("../models/VotoManual");
const fs = require("fs").promises;
const path = require("path");

/**
 * Subir imagen de voto manual
 */
const subirVotoManual = async (req, res) => {
  try {
    // Usar juradoId del body o valor por defecto para demo
    const juradoId = req.body.juradoId || "demo-jurado";

    // Validar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Debe seleccionar una imagen",
      });
    }

    // Crear registro en la base de datos
    const nuevoVotoManual = new VotoManual({
      juradoId,
      imagePath: req.file.path,
      fileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    await nuevoVotoManual.save();

    res.status(201).json({
      success: true,
      message: "Imagen de voto manual subida exitosamente",
      data: {
        id: nuevoVotoManual._id,
        fileName: nuevoVotoManual.fileName,
        fileSize: nuevoVotoManual.fileSize,
        uploadDate: nuevoVotoManual.uploadDate,
        imageUrl: `/uploads/votos-manuales/${nuevoVotoManual.fileName}`,
      },
    });
  } catch (error) {
    console.error("Error al subir voto manual:", error);

    // Eliminar archivo si hubo error en la base de datos
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error al subir la imagen del voto manual",
      error: error.message,
    });
  }
};

/**
 * Obtener todos los votos manuales (con filtro opcional por jurado)
 */
const obtenerVotosManuales = async (req, res) => {
  try {
    const { juradoId } = req.query;

    const filtro = juradoId ? { juradoId } : {};

    const votosManuales = await VotoManual.find(filtro)
      .populate("juradoId", "nombre carnet")
      .sort({ uploadDate: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: votosManuales.length,
      data: votosManuales.map((voto) => ({
        id: voto._id,
        jurado: voto.juradoId,
        fileName: voto.fileName,
        fileSize: voto.fileSize,
        mimeType: voto.mimeType,
        uploadDate: voto.uploadDate,
        procesado: voto.procesado,
        notas: voto.notas,
        imageUrl: `/uploads/votos-manuales/${voto.fileName}`,
      })),
    });
  } catch (error) {
    console.error("Error al obtener votos manuales:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los votos manuales",
      error: error.message,
    });
  }
};

/**
 * Eliminar un voto manual
 */
const eliminarVotoManual = async (req, res) => {
  try {
    const { id } = req.params;

    const votoManual = await VotoManual.findById(id);

    if (!votoManual) {
      return res.status(404).json({
        success: false,
        message: "Voto manual no encontrado",
      });
    }

    // Eliminar archivo del sistema de archivos
    try {
      await fs.unlink(votoManual.imagePath);
    } catch (fileError) {
      console.error("Error al eliminar archivo físico:", fileError);
      // Continuar aunque el archivo no exista
    }

    // Eliminar registro de la base de datos
    await VotoManual.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Voto manual eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar voto manual:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el voto manual",
      error: error.message,
    });
  }
};

module.exports = {
  subirVotoManual,
  obtenerVotosManuales,
  eliminarVotoManual,
};
