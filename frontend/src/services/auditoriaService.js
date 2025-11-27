import apiClient, { handleApiError } from './api';

/**
 * Servicio para auditoría y registros
 * Base URL: /api/auditoria
 */

/**
 * Registra un nuevo evento de auditoría
 * @param {Object} eventoData - Datos del evento de auditoría
 * @returns {Promise<Object>} Evento registrado
 */
export const crearRegistro = async (eventoData) => {
  try {
    const response = await apiClient.post('/api/auditoria', eventoData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtiene todos los registros de auditoría
 * @returns {Promise<Array>} Lista de registros
 */
export const obtenerRegistros = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/eventos');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtiene un registro de auditoría por ID
 * @param {number} id - ID del registro
 * @returns {Promise<Object>} Datos del registro
 */
export const obtenerPorId = async (id) => {
  try {
    const response = await apiClient.get(`/api/auditoria/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Filtra registros por usuario
 * @param {string} usuario - Cédula del usuario
 * @returns {Promise<Array>} Lista de registros del usuario
 */
export const obtenerPorUsuario = async (usuario) => {
  try {
    const response = await apiClient.get(`/api/auditoria/usuario/${usuario}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Filtra registros por tipo de evento
 * @param {string} tipo - Tipo de evento
 * @returns {Promise<Array>} Lista de registros del tipo
 */
export const obtenerPorTipo = async (tipo) => {
  try {
    const response = await apiClient.get(`/api/auditoria/tipo/${tipo}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Filtra registros por módulo
 * @param {string} modulo - Nombre del módulo
 * @returns {Promise<Array>} Lista de registros del módulo
 */
export const obtenerPorModulo = async (modulo) => {
  try {
    const response = await apiClient.get(`/api/auditoria/modulo/${modulo}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Elimina un registro de auditoría
 * @param {number} id - ID del registro
 * @returns {Promise<string>} Mensaje de confirmación
 */
export const eliminarRegistro = async (id) => {
  try {
    const response = await apiClient.delete(`/api/auditoria/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtiene cantidad de eventos agrupados por tipo
 * @returns {Promise<Object>} Mapa con contadores por tipo
 */
export const contarPorTipo = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/contarPorTipo');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtiene cantidad de eventos agrupados por severidad
 * @returns {Promise<Object>} Mapa con contadores por severidad
 */
export const contarPorSeveridad = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/contarPorSeveridad');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtiene cantidad de eventos agrupados por módulo
 * @returns {Promise<Object>} Mapa con contadores por módulo
 */
export const contarPorModulo = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/contarPorModulo');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtiene resumen general de KPIs
 * @returns {Promise<Object>} Resumen estadístico completo
 */
export const obtenerKpis = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/kpis');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Filtra registros con múltiples criterios
 * @param {Object} filtros - Filtros a aplicar {tipo, severidad, modulo, usuario, inicio, fin}
 * @returns {Promise<Array>} Lista de registros filtrados
 */
export const filtrar = async (filtros) => {
  try {
    const params = new URLSearchParams();

    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.severidad) params.append('severidad', filtros.severidad);
    if (filtros.modulo) params.append('modulo', filtros.modulo);
    if (filtros.usuario) params.append('usuario', filtros.usuario);
    if (filtros.inicio) params.append('inicio', filtros.inicio);
    if (filtros.fin) params.append('fin', filtros.fin);

    const response = await apiClient.get(`/api/auditoria/filtros?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Exporta registros de auditoría a CSV
 * @returns {Promise<Array>} Líneas del CSV
 */
export const exportarCSV = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/formatoCsv');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ========== Funciones locales (simuladas) para compatibilidad ==========
// Estas funciones se mantienen para desarrollo sin backend

const tipos = ['LOGIN', 'VOTE_CAST', 'RESULT_PUBLISHED', 'ACTA_REGISTRADA', 'ERROR'];
const modulos = ['usuarios', 'votaciones', 'resultados', 'candidatos', 'auditoria'];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generarLog(id) {
  const tipo = tipos[rand(0, tipos.length - 1)];
  const modulo = modulos[rand(0, modulos.length - 1)];
  const severidad = ['INFO', 'WARN', 'ERROR'][rand(0, 2)];
  const usuario = ['auditor01', 'jmesa12', 'soporte3', 'admin-ti', 'observador'][rand(0, 4)];
  const ahora = Date.now() - rand(0, 1000 * 60 * 60 * 24 * 10);
  const detalle = tipo === 'VOTE_CAST'
    ? 'Registro de voto (hash=0x' + rand(1000, 9999).toString(16) + ')'
    : tipo === 'RESULT_PUBLISHED'
      ? 'Publicación de parcial oficial'
      : tipo === 'ACTA_REGISTRADA'
        ? 'Acta #' + rand(100, 999) + ' registrada y firmada'
        : tipo === 'LOGIN'
          ? 'Inicio de sesión satisfactorio'
          : 'Excepción en pipeline de resultados';

  return {
    id: id.toString(),
    fecha: new Date(ahora).toISOString(),
    tipo, modulo, severidad, usuario, ip: `10.0.${rand(0, 255)}.${rand(0, 255)}`,
    detalle, correlacion: 'corr-' + rand(10000, 99999)
  };
}

let cache = Array.from({ length: 120 }).map((_, i) => generarLog(i + 1));

export function fetchKpis() {
  const total = cache.length;
  const errores = cache.filter(x => x.severidad === 'ERROR').length;
  const votos = cache.filter(x => x.tipo === 'VOTE_CAST').length;
  const actas = cache.filter(x => x.tipo === 'ACTA_REGISTRADA').length;
  return new Promise(res => setTimeout(() => res({ total, errores, votos, actas }), 300));
}

export function fetchLogs({ page = 1, pageSize = 12, q = '', tipo = 'TODO', severidad = 'TODO', modulo = 'TODO' }) {
  let data = [...cache];
  if (q) data = data.filter(x =>
    x.detalle.toLowerCase().includes(q.toLowerCase()) ||
    x.usuario.toLowerCase().includes(q.toLowerCase()) ||
    x.id.includes(q)
  );
  if (tipo !== 'TODO') data = data.filter(x => x.tipo === tipo);
  if (severidad !== 'TODO') data = data.filter(x => x.severidad === severidad);
  if (modulo !== 'TODO') data = data.filter(x => x.modulo === modulo);

  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const slice = data.slice(start, start + pageSize);
  return new Promise(res => setTimeout(() => res({ items: slice, total, pages }), 300));
}

export function fetchLogById(id) {
  const found = cache.find(x => x.id === id);
  return new Promise((res, rej) => setTimeout(() => {
    if (found) res(found); else rej(new Error('No encontrado'));
  }, 200));
}
