// verificationService.js
// Servicio para manejo de códigos de verificación - actualizado para usar backend

import { authAPI } from "./api";

/**
 * Verifica si un código es válido para un carnet
 * @param {string} carnet - Carnet de identidad
 * @param {string} code - Código de verificación a validar
 * @returns {Promise<object>} - Resultado de la verificación
 */
export const verifyCode = async (carnet, code) => {
  try {
    const response = await authAPI.verifyCode(carnet, code);

    if (response.success) {
      return {
        success: true,
        user: response.data.user,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error al verificar código:", error);
    return {
      success: false,
      error: error.message || "Código incorrecto",
    };
  }
};

/**
 * Envía un código de verificación por correo electrónico
 * @param {string} carnet - Carnet de identidad
 * @returns {Promise<object>} - Resultado del envío
 */
export const sendVerificationEmail = async (carnet) => {
  try {
    const response = await authAPI.resendCode(carnet);

    if (response.success) {
      return {
        success: true,
        emailOculto: response.data.emailOculto,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error al enviar código:", error);
    throw new Error(
      error.message || "Error al enviar el código de verificación"
    );
  }
};

/**
 * Hook personalizado para manejar la verificación en dos pasos
 * Este hook ya no es necesario con el backend, pero se mantiene por compatibilidad
 */
export const useTwoFactorAuth = () => {
  console.warn(
    "useTwoFactorAuth está deprecado. Usa las funciones directas de authService."
  );

  return {
    isVerifying: false,
    startVerification: async () => true,
    checkVerification: async () => false,
    cancelVerification: () => {},
    resendCode: async () => null,
  };
};
