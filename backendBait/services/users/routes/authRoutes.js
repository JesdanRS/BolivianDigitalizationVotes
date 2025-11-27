// routes/authRoutes.js
// Rutas para autenticación de usuarios

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const adminAuthController = require("../controllers/adminAuthController");

// POST /api/auth/login - Iniciar sesión con carnet y fecha de nacimiento
router.post("/login", authController.login);

// POST /api/auth/verify-code - Verificar código de verificación
router.post("/verify-code", authController.verifyCode);

// POST /api/auth/resend-code - Reenviar código de verificación
router.post("/resend-code", authController.resendCode);

// POST /api/auth/admin-login - Iniciar sesión para administradores, jurados y auditores
router.post("/admin-login", adminAuthController.adminLogin);

module.exports = router;
