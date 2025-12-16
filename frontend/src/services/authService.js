// authService.js
// Servicio de autenticación para conectar con usuarios-service a través del API Gateway

import { authAPI, ocultarEmail } from "./api";

/**
 * Autentica un usuario con carnet y fecha de nacimiento.
 * El backend envía automáticamente un código de verificación al correo registrado.
 * @param {string} carnet - Carnet de identidad
 * @param {string} fechaNacimiento - Fecha de nacimiento (formato DD/MM/AAAA)
 * @returns {Promise<object>} - Resultado de la autenticación
 */
export const authenticateUser = async (carnet, fechaNacimiento) => {
  try {
    const response = await authAPI.login(carnet, fechaNacimiento);

    // El backend devuelve AuthResponseDto con emailOculto
    if (response) {
      return {
        success: true,
        data: {
          emailOculto:
            response.emailOculto || ocultarEmail(response.correoElectronico),
          carnet: response.carnet || carnet,
        },
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error en authenticateUser:", error);
    return {
      success: false,
      error: error.message || "Error al autenticar usuario",
    };
  }
};

/**
 * Verifica el código de verificación ingresado
 * @param {string} carnet - Carnet de identidad
 * @param {string} codigo - Código de verificación de 6 dígitos
 * @returns {Promise<object>} - Resultado de la verificación con datos del usuario
 */
export const verifyCode = async (carnet, codigo) => {
  try {
    const response = await authAPI.verifyCode(carnet, codigo);

    // Si la respuesta es exitosa (puede ser vacía o con datos de usuario)
    // Construimos el objeto user con los datos del carnet
    return {
      success: true,
      user: response?.user || {
        carnet: carnet,
        role: "usuario",
        isAuthenticated: true,
      },
    };
  } catch (error) {
    console.error("Error en verifyCode:", error);
    return {
      success: false,
      error: error.message || "Código incorrecto",
    };
  }
};

/**
 * Reenvía el código de verificación
 * @param {string} carnet - Carnet de identidad
 * @returns {Promise<object>} - Resultado del reenvío
 */
export const resendVerificationCode = async (carnet) => {
  try {
    await authAPI.resendCode(carnet);

    // El backend responde con 200 OK sin body
    // El código se envía al correo registrado del usuario
    return {
      success: true,
      emailOculto: "tu correo registrado", // El frontend puede mostrar esto
    };
  } catch (error) {
    console.error("Error en resendVerificationCode:", error);
    return {
      success: false,
      error: error.message || "Error al reenviar código",
    };
  }
};

/**
 * Autentica administradores, auditores o jurados
 * @param {string} carnet - Carnet de identidad
 * @param {string} fechaNacimiento - Fecha de nacimiento (formato DD/MM/AAAA)
 * @param {string} correo - Correo electrónico
 * @param {string} password - Contraseña
 * @returns {Promise<object>} - Resultado de la autenticación
 */
export const authenticateAdmin = async (
  carnet,
  fechaNacimiento,
  correo,
  password
) => {
  try {
    const response = await authAPI.adminLogin(
      carnet,
      fechaNacimiento,
      correo,
      password
    );

    if (response) {
      return {
        success: true,
        user: response.user || response,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error en authenticateAdmin:", error);
    return {
      success: false,
      error: error.message || "Error al autenticar",
    };
  }
};

// Guardar datos de usuario en localStorage
export const saveUserData = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

// Obtener datos de usuario del localStorage
export const getUserData = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

// Verificar si hay un usuario autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("user");
};
