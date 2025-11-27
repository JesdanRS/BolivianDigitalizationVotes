import axios from 'axios';

// Configuración de Keycloak
const KEYCLOAK_URL = 'http://localhost:8090';
const REALM = 'votaciones';
const CLIENT_ID = 'votaciones-client';
const CLIENT_SECRET = '26Q02wNNRORoRTOmSFT0kvVJnksLymkq';

// Usuarios predefinidos por rol
const USERS_BY_ROLE = {
  USER: {
    username: 'user@votaciones.com',
    password: 'user123',
    role: 'USER'
  },
  AUDITOR: {
    username: 'auditor@votaciones.com',
    password: 'auditor123',
    role: 'AUDITOR'
  },
  ADMIN: {
    username: 'admin@votaciones.com',
    password: 'admin123',
    role: 'ADMIN'
  }
};

/**
 * Obtiene un token de acceso desde Keycloak para un rol específico
 * @param {string} role - El rol deseado: 'USER', 'AUDITOR', o 'ADMIN'
 * @returns {Promise<Object>} Objeto con token y datos del usuario
 */
export const getTokenByRole = async (role) => {
  const user = USERS_BY_ROLE[role];

  if (!user) {
    throw new Error(`Rol inválido: ${role}. Debe ser USER, AUDITOR, o ADMIN`);
  }

  try {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'password');
    params.append('username', user.username);
    params.append('password', user.password);

    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const tokenData = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type,
      role: user.role,
      username: user.username,
      timestamp: Date.now()
    };

    // Guardar en localStorage
    localStorage.setItem('keycloak_token', JSON.stringify(tokenData));

    return tokenData;
  } catch (error) {
    console.error('Error al obtener token de Keycloak:', error.response?.data || error.message);
    throw new Error('No se pudo obtener el token de autenticación. Verifica que Keycloak esté ejecutándose.');
  }
};

/**
 * Refresca el token de acceso usando el refresh token
 * @returns {Promise<Object>} Nuevo objeto con token actualizado
 */
export const refreshToken = async () => {
  const storedToken = getStoredToken();

  if (!storedToken || !storedToken.refreshToken) {
    throw new Error('No hay refresh token disponible');
  }

  try {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', storedToken.refreshToken);

    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const tokenData = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type,
      role: storedToken.role,
      username: storedToken.username,
      timestamp: Date.now()
    };

    // Actualizar en localStorage
    localStorage.setItem('keycloak_token', JSON.stringify(tokenData));

    return tokenData;
  } catch (error) {
    console.error('Error al refrescar token:', error.response?.data || error.message);
    // Si falla el refresh, limpiar el token almacenado
    clearToken();
    throw new Error('No se pudo refrescar el token. Por favor, vuelve a iniciar sesión.');
  }
};

/**
 * Obtiene el token almacenado en localStorage
 * @returns {Object|null} Datos del token o null si no existe
 */
export const getStoredToken = () => {
  const tokenStr = localStorage.getItem('keycloak_token');
  return tokenStr ? JSON.parse(tokenStr) : null;
};

/**
 * Verifica si el token ha expirado
 * @returns {boolean} true si el token ha expirado
 */
export const isTokenExpired = () => {
  const storedToken = getStoredToken();

  if (!storedToken) {
    return true;
  }

  const now = Date.now();
  const expirationTime = storedToken.timestamp + (storedToken.expiresIn * 1000);

  // Considerar expirado si queda menos de 1 minuto
  return now >= (expirationTime - 60000);
};

/**
 * Obtiene un token válido, refrescándolo si es necesario
 * @returns {Promise<string>} Token de acceso válido
 */
export const getValidToken = async () => {
  const storedToken = getStoredToken();

  if (!storedToken) {
    throw new Error('No hay sesión activa. Por favor, inicia sesión.');
  }

  if (isTokenExpired()) {
    const newToken = await refreshToken();
    return newToken.accessToken;
  }

  return storedToken.accessToken;
};

/**
 * Limpia el token del localStorage
 */
export const clearToken = () => {
  localStorage.removeItem('keycloak_token');
};

/**
 * Obtiene el rol del usuario actual
 * @returns {string|null} Rol del usuario o null
 */
export const getCurrentRole = () => {
  const storedToken = getStoredToken();
  return storedToken ? storedToken.role : null;
};

/**
 * Verifica si hay una sesión activa
 * @returns {boolean} true si hay sesión activa
 */
export const hasActiveSession = () => {
  const storedToken = getStoredToken();
  return storedToken !== null && !isTokenExpired();
};
