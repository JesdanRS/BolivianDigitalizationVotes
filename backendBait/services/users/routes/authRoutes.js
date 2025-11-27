// routes/authRoutes.js
// Rutas para autenticación de usuarios

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/auth/login - Iniciar sesión con carnet y fecha de nacimiento
router.post("/login", authController.login);

// POST /api/auth/verify-code - Verificar código de verificación
router.post("/verify-code", authController.verifyCode);

// POST /api/auth/resend-code - Reenviar código de verificación
router.post("/resend-code", authController.resendCode);

module.exports = router;
