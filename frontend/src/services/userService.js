import apiClient, { handleApiError } from './api';

/**
 * Servicio para gestión de usuarios
 * Base URL: /api/usuarios
 */

/**
 * Autentica un usuario
 * @param {Object} loginData - Datos de login { carnet, fechaNacimiento }
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export const login = async (loginData) => {
  try {
    const response = await apiClient.post('/api/usuarios/login', loginData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Solicita un código de verificación por correo
 * @param {string} carnet - Número de carnet del usuario
 * @returns {Promise<void>}
 */
export const solicitarCodigo = async (carnet) => {
  try {
    const response = await apiClient.post(`/api/usuarios/${carnet}/solicitar-codigo`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Verifica el código enviado al correo
 * @param {string} carnet - Número de carnet del usuario
 * @param {string} codigo - Código de verificación
 * @returns {Promise<void>}
 */
export const verificarCodigo = async (carnet, codigo) => {
  try {
    const response = await apiClient.post(`/api/usuarios/${carnet}/verificar-codigo`, { codigo });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtiene el perfil de un usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Promise<Object>} Datos del perfil del usuario
 */
export const obtenerPerfil = async (id) => {
  try {
    const response = await apiClient.get(`/api/usuarios/perfil/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Carga masiva de usuarios (requiere rol ADMIN)
 * @param {Array} usuarios - Lista de usuarios a cargar
 * @returns {Promise<string>} Mensaje de confirmación
 */
export const cargaMasiva = async (usuarios) => {
  try {
    const response = await apiClient.post('/api/usuarios/carga-masiva', usuarios);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ========== Funciones locales para gestión de usuarios (complementarias) ==========
// Estas funciones mantienen compatibilidad con el sistema actual del frontend

// Estado inicial de usuarios por rol (locales)
const initialUsers = {
  jurados: [
    { id: 1, carnet: '8812438', nombre: 'Juan Carlos Rojas', email: 'juan.rojas@example.com', estado: true },
    { id: 2, carnet: '9234567', nombre: 'María García López', email: 'maria.garcia@example.com', estado: true },
  ],
  administradores: [
    { id: 3, carnet: '8466316', nombre: 'Roberto Fernández', email: 'roberto.fer@example.com', estado: true },
  ],
  poblacion: [
    { id: 4, carnet: '13120200', nombre: 'Juan Pérez', email: 'juan.perez@example.com', estado: true },
    { id: 5, carnet: '12735190', nombre: 'María Flores', email: 'maria.flores@example.com', estado: false },
    { id: 6, carnet: '13491987', nombre: 'Carlos López', email: 'carlos.lopez@example.com', estado: true },
  ]
};

// Obtener usuarios del localStorage o usar iniciales
const getStoredUsers = () => {
  const stored = localStorage.getItem('usuarios');
  return stored ? JSON.parse(stored) : initialUsers;
};

// Guardar usuarios en localStorage
const saveUsers = (usuarios) => {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
};

// Obtener todos los usuarios de un rol
export const getUsersByRole = (rol) => {
  const usuarios = getStoredUsers();
  return usuarios[rol] || [];
};

// Obtener usuario por ID
export const getUserById = (id, rol) => {
  const usuarios = getUsersByRole(rol);
  return usuarios.find(u => u.id === id);
};

// Crear nuevo usuario
export const createUser = (rol, userData) => {
  const usuarios = getStoredUsers();
  const nuevoUsuario = {
    id: Math.max(...usuarios[rol].map(u => u.id), 0) + 1,
    ...userData,
    estado: true
  };
  usuarios[rol].push(nuevoUsuario);
  saveUsers(usuarios);
  return nuevoUsuario;
};

// Actualizar usuario
export const updateUser = (id, rol, userData) => {
  const usuarios = getStoredUsers();
  const index = usuarios[rol].findIndex(u => u.id === id);
  if (index !== -1) {
    usuarios[rol][index] = { ...usuarios[rol][index], ...userData };
    saveUsers(usuarios);
    return usuarios[rol][index];
  }
  return null;
};

// Cambiar estado de usuario (activar/desactivar)
export const toggleUserStatus = (id, rol) => {
  const usuarios = getStoredUsers();
  const usuario = usuarios[rol].find(u => u.id === id);
  if (usuario) {
    usuario.estado = !usuario.estado;
    saveUsers(usuarios);
    return usuario;
  }
  return null;
};

// Eliminar usuario
export const deleteUser = (id, rol) => {
  const usuarios = getStoredUsers();
  usuarios[rol] = usuarios[rol].filter(u => u.id !== id);
  saveUsers(usuarios);
};

// Procesar archivo CSV
export const procesarCSV = (contenido, rol) => {
  const lineas = contenido.split('\n').filter(linea => linea.trim());
  const usuarios = getStoredUsers();
  let usuariosAgregados = 0;
  let errores = [];

  // Saltar encabezado si existe
  const inicio = lineas[0].toLowerCase().includes('carnet') ? 1 : 0;

  lineas.slice(inicio).forEach((linea, index) => {
    try {
      const [carnet, nombre, email] = linea.split(',').map(c => c.trim());

      if (!carnet || !nombre || !email) {
        errores.push(`Fila ${index + inicio + 1}: Faltan datos requeridos`);
        return;
      }

      // Verificar si el usuario ya existe
      const existe = usuarios[rol].some(u => u.carnet === carnet);
      if (existe) {
        errores.push(`Fila ${index + inicio + 1}: El carnet ${carnet} ya existe`);
        return;
      }

      // Crear nuevo usuario
      const nuevoUsuario = {
        id: Math.max(...Object.values(usuarios).flat().map(u => u.id), 0) + 1,
        carnet,
        nombre,
        email,
        estado: true
      };

      usuarios[rol].push(nuevoUsuario);
      usuariosAgregados++;
    } catch (error) {
      errores.push(`Fila ${index + inicio + 1}: Error al procesar - ${error.message}`);
    }
  });

  saveUsers(usuarios);

  return {
    exito: true,
    usuariosAgregados,
    errores,
    usuariosProcesados: lineas.slice(inicio).length
  };
};

// Descargar plantilla CSV
export const descargarPlantillaCSV = (rol) => {
  const contenido = 'Carnet,Nombre,Email\n';
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `plantilla-${rol}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar usuarios a CSV
export const exportarUsuariosCSV = (rol) => {
  const usuarios = getUsersByRole(rol);
  let contenido = 'ID,Carnet,Nombre,Email,Estado\n';

  usuarios.forEach(u => {
    contenido += `${u.id},${u.carnet},${u.nombre},${u.email},${u.estado ? 'Activo' : 'Inactivo'}\n`;
  });

  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `usuarios-${rol}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
