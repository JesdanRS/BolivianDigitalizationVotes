// routes/votoManualRoutes.js
// Rutas para la gestión de votos manuales (imágenes físicas)

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  subirVotoManual,
  obtenerVotosManuales,
  eliminarVotoManual,
} = require("../controllers/votoManualController");

// Configurar directorio de uploads
const uploadDir = path.join(__dirname, "../../../uploads/votos-manuales");

// Crear directorio si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp + nombre original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "voto-" + uniqueSuffix + ext);
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo se aceptan imágenes JPG, JPEG y PNG"
      ),
      false
    );
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: fileFilter,
});

/**
 * @route   POST /api/votaciones/votos-manuales
 * @desc    Subir imagen de voto manual
 * @access  Private (Jurado)
 */
router.post("/", upload.single("imagen"), subirVotoManual);

/**
 * @route   GET /api/votaciones/votos-manuales
 * @desc    Obtener todos los votos manuales
 * @access  Private (Jurado/Admin)
 */
router.get("/", obtenerVotosManuales);

/**
 * @route   DELETE /api/votaciones/votos-manuales/:id
 * @desc    Eliminar un voto manual
 * @access  Private (Jurado/Admin)
 */
router.delete("/:id", eliminarVotoManual);

// Manejo de errores de Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "El archivo es demasiado grande. Máximo 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Error al procesar el archivo",
      error: error.message,
    });
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
});

module.exports = router;
