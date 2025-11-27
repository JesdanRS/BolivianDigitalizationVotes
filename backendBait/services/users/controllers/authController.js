// controllers/authController.js
// Controlador para autenticación de usuarios

const Votante = require("../models/votanteModel");
const { enviarCodigoVerificacion } = require("../services/emailService");

// Almacenamiento temporal de códigos de verificación
// En producción, esto debería estar en Redis o en la base de datos
const codigosVerificacion = new Map();

/**
 * Genera un código de verificación de 6 dígitos
 */
const generarCodigoVerificacion = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * POST /api/auth/login
 * Inicia el proceso de autenticación con carnet y fecha de nacimiento
 */
const login = async (req, res) => {
  try {
    const { carnet, fechaNacimiento } = req.body;

    // Validar que se proporcionaron todos los campos
    if (!carnet || !fechaNacimiento) {
      return res.status(400).json({
        success: false,
        message: "Por favor proporcione carnet y fecha de nacimiento",
      });
    }

    // Buscar votante por carnet
    const votante = await Votante.findOne({ carnet: carnet.trim() });

    if (!votante) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar fecha de nacimiento
    if (!votante.compararFechaNacimiento(fechaNacimiento)) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar código de verificación
    const codigoVerificacion = generarCodigoVerificacion();

    // Almacenar código con tiempo de expiración (10 minutos)
    const codigoData = {
      codigo: codigoVerificacion,
      carnet: votante.carnet,
      email: votante.correo,
      timestamp: Date.now(),
      expiracion: Date.now() + 10 * 60 * 1000, // 10 minutos
    };

    codigosVerificacion.set(votante.carnet, codigoData);

    // Enviar código por correo electrónico
    try {
      await enviarCodigoVerificacion(
        votante.correo,
        codigoVerificacion,
        votante.nombre
      );
    } catch (emailError) {
      console.error("Error al enviar email:", emailError);
      // Continuar el flujo aunque falle el email (útil para desarrollo)
      console.log(`💡 Código para ${votante.carnet}: ${codigoVerificacion}`);
    }

    // Limpiar códigos expirados (limpieza periódica)
    limpiarCodigosExpirados();

    // Responder con éxito y email parcialmente oculto
    res.status(200).json({
      success: true,
      message: "Código de verificación enviado",
      data: {
        emailOculto: votante.getEmailOculto(),
        carnet: votante.carnet,
        nombre: votante.nombre,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud",
    });
  }
};

/**
 * POST /api/auth/verify-code
 * Verifica el código ingresado por el usuario
 */
const verifyCode = async (req, res) => {
  try {
    const { carnet, codigo } = req.body;

    // Validar campos
    if (!carnet || !codigo) {
      return res.status(400).json({
        success: false,
        message: "Por favor proporcione carnet y código",
      });
    }

    // Buscar código almacenado
    const codigoData = codigosVerificacion.get(carnet.trim());

    if (!codigoData) {
      return res.status(401).json({
        success: false,
        message: "Código inválido o expirado",
      });
    }

    // Verificar si el código ha expirado
    if (Date.now() > codigoData.expiracion) {
      codigosVerificacion.delete(carnet.trim());
      return res.status(401).json({
        success: false,
        message: "El código ha expirado. Solicita uno nuevo.",
      });
    }

    // Verificar si el código coincide
    if (codigoData.codigo !== codigo.trim()) {
      return res.status(401).json({
        success: false,
        message: "Código incorrecto",
      });
    }

    // Código válido - eliminar de la memoria
    codigosVerificacion.delete(carnet.trim());

    // Obtener datos completos del votante
    const votante = await Votante.findOne({ carnet: carnet.trim() });

    if (!votante) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Responder con datos del usuario autenticado
    res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      data: {
        user: {
          _id: votante._id,
          nombre: votante.nombre,
          carnet: votante.carnet,
          correo: votante.correo,
          fechaNacimiento: votante.fechaNacimiento,
          haVotado: votante.haVotado,
          role: "usuario",
        },
      },
    });
  } catch (error) {
    console.error("Error en verify-code:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar el código",
    });
  }
};

/**
 * POST /api/auth/resend-code
 * Reenvía un código de verificación
 */
const resendCode = async (req, res) => {
  try {
    const { carnet } = req.body;

    // Validar campo
    if (!carnet) {
      return res.status(400).json({
        success: false,
        message: "Por favor proporcione el carnet",
      });
    }

    // Buscar votante
    const votante = await Votante.findOne({ carnet: carnet.trim() });

    if (!votante) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Generar nuevo código
    const nuevoCodigoVerificacion = generarCodigoVerificacion();

    // Actualizar código almacenado
    const codigoData = {
      codigo: nuevoCodigoVerificacion,
      carnet: votante.carnet,
      email: votante.correo,
      timestamp: Date.now(),
      expiracion: Date.now() + 10 * 60 * 1000, // 10 minutos
    };

    codigosVerificacion.set(votante.carnet, codigoData);

    // Enviar nuevo código por correo
    try {
      await enviarCodigoVerificacion(
        votante.correo,
        nuevoCodigoVerificacion,
        votante.nombre
      );
    } catch (emailError) {
      console.error("Error al enviar email:", emailError);
      console.log(
        `💡 Código para ${votante.carnet}: ${nuevoCodigoVerificacion}`
      );
    }

    res.status(200).json({
      success: true,
      message: "Nuevo código enviado",
      data: {
        emailOculto: votante.getEmailOculto(),
      },
    });
  } catch (error) {
    console.error("Error en resend-code:", error);
    res.status(500).json({
      success: false,
      message: "Error al reenviar el código",
    });
  }
};

/**
 * Limpia códigos de verificación expirados de la memoria
 */
const limpiarCodigosExpirados = () => {
  const ahora = Date.now();
  for (const [carnet, data] of codigosVerificacion.entries()) {
    if (ahora > data.expiracion) {
      codigosVerificacion.delete(carnet);
    }
  }
};

// Ejecutar limpieza cada 5 minutos
setInterval(limpiarCodigosExpirados, 5 * 60 * 1000);

module.exports = {
  login,
  verifyCode,
  resendCode,
};
