// Servicio para manejo de códigos de verificación
import { useState } from 'react';

// Objeto para almacenar los códigos generados (en una app real esto sería en el backend)
const verificationCodes = {};

/**
 * Genera un código de verificación de 6 dígitos para un correo electrónico
 * @param {string} email - Correo electrónico al que se enviará el código
 * @returns {string} - Código de verificación generado
 */
export const generateVerificationCode = (email) => {
  // Genera un código aleatorio de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Almacena el código asociado al email (en una app real esto sería en el backend)
  verificationCodes[email] = code;

  // Simula envío de correo electrónico (solo para prototipo)
  console.log(`Código de verificación para ${email}: ${code}`);

  return code;
};

/**
 * Verifica si un código es válido para un correo electrónico
 * @param {string} email - Correo electrónico
 * @param {string} code - Código de verificación a validar
 * @returns {boolean} - true si el código es válido, false en caso contrario
 */
export const verifyCode = (email, code) => {
  // Verifica si el código existe y coincide (en una app real esto sería en el backend)
  return verificationCodes[email] === code;
};

/**
 * Simula el envío de un correo electrónico con el código de verificación
 * @param {string} email - Correo electrónico al que enviar el código
 * @returns {Promise<string>} - Promesa que se resuelve con el código enviado
 */
export const sendVerificationEmail = async (email) => {
  // Genera un nuevo código de verificación
  const code = generateVerificationCode(email);

  // Simula retardo del envío de correo
  return new Promise((resolve) => {
    setTimeout(() => {
      // En una app real, aquí se enviaría el correo mediante una API
      console.log(`✉️ Correo enviado a ${email} con código: ${code}`);

      // Muestra el código en un alert para facilitar las pruebas
      alert(`Código de verificación enviado: ${code}\n(Este alert es solo para la demo)`);

      resolve(code);
    }, 1000); // Retardo de 1 segundo para simular envío
  });
};

/**
 * Hook personalizado para manejar la verificación en dos pasos
 * @returns {Object} - Objeto con funciones y estado para la verificación
 */
export const useTwoFactorAuth = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const startVerification = async (email) => {
    setCurrentEmail(email);
    setIsVerifying(true);
    await sendVerificationEmail(email);
    return true;
  };

  const checkVerification = (code) => {
    const isValid = verifyCode(currentEmail, code);
    if (isValid) {
      setIsVerifying(false);
    }
    return isValid;
  };

  const cancelVerification = () => {
    setIsVerifying(false);
    setCurrentEmail('');
  };

  const resendCode = async () => {
    if (currentEmail) {
      return await sendVerificationEmail(currentEmail);
    }
    return null;
  };

  return {
    isVerifying,
    startVerification,
    checkVerification,
    cancelVerification,
    resendCode
  };
};
