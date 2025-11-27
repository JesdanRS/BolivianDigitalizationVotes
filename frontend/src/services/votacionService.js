// src/services/votacionService.js
import apiClient, { handleApiError } from './api';
import axios from 'axios';
import { getTokenByRole } from './keycloakService';

/**
 * Servicio para gestión de votaciones
 * Base URL: /api/votaciones
 *
 * POST /api/votaciones requiere rol ADMIN.
 */

const API_BASE = ''; // mismo origen, Vite hace proxy

// Ejecuta una función usando un token ADMIN y después restaura el token original
const withAdminToken = async (fn) => {
  const backupTokenStr = localStorage.getItem('keycloak_token');
  try {
    const adminTokenData = await getTokenByRole('ADMIN');
    const adminAccessToken = adminTokenData.accessToken;

    return await fn(adminAccessToken);
  } finally {
    if (backupTokenStr !== null) {
      localStorage.setItem('keycloak_token', backupTokenStr);
    } else {
      localStorage.removeItem('keycloak_token');
    }
  }
};

/**
 * Crea una nueva votación (requiere rol ADMIN en el backend)
 * @param {Object} votacionData - { partido, candidato, localidad, fecha }
 * @returns {Promise<Object>} Votación creada
 */
export const crearVotacion = async (votacionData) => {
  try {
    return await withAdminToken(async (adminToken) => {
      const response = await axios.post(
        `${API_BASE}/api/votaciones`,
        votacionData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      return response.data;
    });
  } catch (error) {
    console.error('[votacionService] Error creando votación', error);
    throw handleApiError(error);
  }
};

/**
 * Helper para emitir un voto desde el front
 * DTO backend: VotacionCreacionDto
 *  - partido   : string
 *  - candidato : string
 *  - localidad : string
 *  - fecha     : Instant (ISO-8601)
 */
export const emitirVoto = async ({ partido, candidato, localidad }) => {
  const localidadFinal = localidad || 'La Paz';

  const payload = {
    partido,
    candidato,
    localidad: localidadFinal,
    fecha: new Date().toISOString(),
  };

  return crearVotacion(payload);
};

/**
 * Obtiene una votación por ID
 */
export const obtenerVotacion = async (id) => {
  try {
    const response = await apiClient.get(`/api/votaciones/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lista todas las votaciones con token “normal”
 * (solo si tu backend lo permite sin rol especial)
 */
export const listarVotaciones = async () => {
  try {
    const response = await apiClient.get('/api/votaciones');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lista todas las votaciones usando token ADMIN.
 */
export const listarVotacionesAdmin = async () => {
  try {
    return await withAdminToken(async (adminToken) => {
      const response = await axios.get(`${API_BASE}/api/votaciones`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      return response.data;
    });
  } catch (error) {
    console.error('[votacionService] Error listando votaciones como ADMIN', error);
    throw handleApiError(error);
  }
};

/**
 * EXTRAER ID USUARIO DEL VOTO
 * AJUSTA AQUÍ: debe coincidir con la propiedad real en tu entidad Votación.
 * Ejemplos posibles: ciUsuario, carnet, cedulaIdentidad, usuarioId, etc.
 */
const extraerIdUsuarioDeVoto = (v) => {
  // Cambia 'ciUsuario' por el nombre REAL del campo en tu JSON
  return v.ciUsuario;
};

/**
 * Verifica en el backend si un usuario ya ha votado.
 * @param {string|number} idUsuario - CI / ID del usuario
 * @returns {Promise<boolean>}
 */
export const haVotadoUsuario = async (idUsuario) => {
  try {
    const lista = await listarVotacionesAdmin();

    if (!Array.isArray(lista)) return false;

    const objetivo = String(idUsuario);

    return lista.some((voto) => {
      const id = extraerIdUsuarioDeVoto(voto);
      if (id == null) return false;
      return String(id) === objetivo;
    });
  } catch (error) {
    console.error('[votacionService] Error verificando si usuario ha votado', error);
    // Si hay error de red/backend, por seguridad aquí devuelvo false
    // para no bloquear el voto. Si quieres bloquear, cámbialo a `return true;`
    return false;
  }
};

/**
 * Busca votaciones por localidad
 */
export const buscarVotacionesPorLocalidad = async (localidad) => {
  try {
    const response = await apiClient.get(`/api/votaciones/localidad/${localidad}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};