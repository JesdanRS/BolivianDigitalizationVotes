// authService.js
// Servicio de autenticación actualizado para trabajar con el backend

import { authAPI } from "./api";

/**
 * Autentica un usuario con carnet y fecha de nacimiento
 * @param {string} carnet - Carnet de identidad
 * @param {string} fechaNacimiento - Fecha de nacimiento (formato DD/MM/AAAA)
 * @returns {Promise<object>} - Resultado de la autenticación
 */
export const authenticateUser = async (carnet, fechaNacimiento) => {
  try {
    const response = await authAPI.login(carnet, fechaNacimiento);

    if (response.success) {
      return {
        success: true,
        data: response.data,
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
 * @returns {Promise<object>} - Resultado de la verificación
 */
export const verifyCode = async (carnet, codigo) => {
  try {
    const response = await authAPI.verifyCode(carnet, codigo);

    if (response.success) {
      return {
        success: true,
        user: response.data.user,
      };
    }

    return { success: false };
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
    const response = await authAPI.resendCode(carnet);

    if (response.success) {
      return {
        success: true,
        emailOculto: response.data.emailOculto,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error en resendVerificationCode:", error);
    return {
      success: false,
      error: error.message || "Error al reenviar código",
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

// Datos predefinidos de usuarios para mostrar en MiVoto
export const getUserDisplayData = (carnet) => {
  // Datos de ejemplo para mostrar en MiVoto según el carnet
  const userDisplayData = {
    13120200: {
      nombreCompleto: "Juan Carlos Pérez",
      cedulaIdentidad: "13120200",
      lugarVotacion: "Unidad Educativa San Agustín",
      mesaSufragio: "42",
      fechaEmision: "23/10/2025",
    },
    12735190: {
      nombreCompleto: "María Flores Rodríguez",
      cedulaIdentidad: "12735190",
      lugarVotacion: "Colegio Don Bosco",
      mesaSufragio: "17",
      fechaEmision: "23/10/2025",
    },
  };

  return userDisplayData[carnet] || null;
};

/**
 * Autentica administradores, auditores o jurados (con contraseña)
 * Esta función mantiene autenticación local para roles administrativos
 * @param {string} carnet - Carnet de identidad
 * @param {string} fechaNacimiento - Fecha de nacimiento (formato DD/MM/AAAA)
 * @param {string} password - Contraseña
 * @returns {object} - Resultado de la autenticación
 */
export const authenticateAdmin = (carnet, fechaNacimiento, password) => {
  // Lista de usuarios administrativos predefinidos
  const adminUsers = [
    {
      carnet: "8466316",
      fechaNacimiento: "19/08/2003",
      password: "12345",
      role: "admin",
    },
    {
      carnet: "8812438",
      fechaNacimiento: "27/07/2003",
      password: "12345",
      role: "auditor",
    },
    {
      carnet: "13491987",
      fechaNacimiento: "04/02/2004",
      password: "12345",
      role: "jurado",
    },
  ];

  const user = adminUsers.find(
    (u) =>
      u.carnet === carnet &&
      u.fechaNacimiento === fechaNacimiento &&
      (u.role === "auditor" || u.role === "jurado" || u.role === "admin") &&
      u.password === password
  );

  if (user) {
    return {
      success: true,
      user: {
        carnet: user.carnet,
        fechaNacimiento: user.fechaNacimiento,
        role: user.role,
      },
    };
  }

  return { success: false };
};
