// controllers/adminAuthController.js
// Controlador para autenticación de administradores, jurados y auditores

const Administrador = require("../models/administradorModel");

/**
 * POST /api/auth/admin-login
 * Autentica administradores, jurados y auditores
 */
const adminLogin = async (req, res) => {
  try {
    const { carnet, fechaNacimiento, correo, password } = req.body;

    console.log("=== INTENTO DE LOGIN ADMIN ===");
    console.log("Datos recibidos:", {
      carnet,
      fechaNacimiento,
      correo,
      password,
    });

    // Validar que se proporcionaron todos los campos
    if (!carnet || !fechaNacimiento || !correo || !password) {
      return res.status(400).json({
        success: false,
        message: "Por favor proporcione todos los campos requeridos",
      });
    }

    // Buscar administrador por carnet y correo
    const administrador = await Administrador.findOne({
      carnet: carnet.trim(),
      correo: correo.trim().toLowerCase(),
    });

    if (!administrador) {
      console.log("❌ Admin no encontrado en DB con:", {
        carnet: carnet.trim(),
        correo: correo.trim().toLowerCase(),
      });
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas (Usuario no encontrado)",
      });
    }

    console.log("✅ Admin encontrado:", administrador.nombre);
    console.log("Datos en DB:", {
      carnet: administrador.carnet,
      correo: administrador.correo,
      fechaNacimiento: administrador.fechaNacimiento,
      passwordHash: administrador.password.substring(0, 10) + "...",
    });

    // Verificar fecha de nacimiento
    const fechaValida = administrador.compararFechaNacimiento(fechaNacimiento);
    if (!fechaValida) {
      console.log("❌ Fecha nacimiento incorrecta.");
      console.log(
        "  Recibida:",
        fechaNacimiento,
        `(${typeof fechaNacimiento})`
      );
      console.log(
        "  En DB:   ",
        administrador.fechaNacimiento,
        `(${typeof administrador.fechaNacimiento})`
      );
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas (Fecha incorrecta)",
      });
    }

    // Verificar contraseña
    const passwordValida = await administrador.compararPassword(password);
    console.log("Verificando password:", password);
    console.log("Resultado comparación:", passwordValida);

    if (!passwordValida) {
      console.log("❌ Password incorrecto");
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas (Password incorrecto)",
      });
    }

    // Autenticación exitosa
    console.log("✅ Autenticación exitosa");
    res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      data: {
        user: {
          nombre: administrador.nombre,
          carnet: administrador.carnet,
          correo: administrador.correo,
          fechaNacimiento: administrador.fechaNacimiento,
          role: administrador.role,
        },
      },
    });
  } catch (error) {
    console.error("Error en admin-login:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud",
    });
  }
};

module.exports = {
  adminLogin,
};
