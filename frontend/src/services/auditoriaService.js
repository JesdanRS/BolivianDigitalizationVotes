// Servicio de auditoría - Conecta con el backend real
// Similar al patrón usado en votacion.jsx con Keycloak

const API_BASE_URL = 'http://localhost:8080/api/auditoria';

/**
 * Obtiene el token de Keycloak desde el singleton
 * Debe ser llamado con keycloak.token disponible
 */
function getKeycloakToken() {
  // El token se pasará como parámetro en cada función
  // para evitar dependencias circulares con keycloak
  return null;
}

/**
 * Realiza una petición GET al backend con autenticación
 * @param {string} endpoint - Endpoint relativo a API_BASE_URL
 * @param {string} token - Token de Keycloak
 * @param {object} params - Parámetros query opcionales
 */
async function fetchWithAuth(endpoint, token, params = {}) {
  if (!token) {
    throw new Error('No hay token de autenticación disponible');
  }

  // Construir URL con parámetros
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== 'TODO') {
      url.searchParams.append(key, params[key]);
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * Obtiene los KPIs de auditoría
 * Usa el endpoint GET /api/auditoria/kpis
 * @param {string} keycloakToken - Token de autenticación de Keycloak
 */
export async function fetchKpis(keycloakToken) {
  try {
    const data = await fetchWithAuth('/kpis', keycloakToken);

    // Mapear la respuesta del backend a la estructura esperada por el frontend
    // El backend devuelve: { totalEventos, porTipo, porSeveridad, porModulo, ultimoEvento }
    const total = data.totalEventos || 0;
    const errores = data.porSeveridad?.ERROR || 0;
    // El backend usa VOTO_EMITIDO en lugar de VOTE_CAST
    const votos = data.porTipo?.VOTO_EMITIDO || 0;
    const actas = data.porTipo?.ACTA_REGISTRADA || 0;

    console.log('KPIs del backend:', data); // Para debug
    console.log('KPIs mapeados:', { total, errores, votos, actas });

    return { total, errores, votos, actas };
  } catch (error) {
    console.error('Error al obtener KPIs de auditoría:', error);
    // Retornar valores por defecto en caso de error
    return { total: 0, errores: 0, votos: 0, actas: 0 };
  }
}

/**
 * Obtiene registros de auditoría con filtros y paginación
 * Usa el endpoint GET /api/auditoria/filtros
 * @param {object} options - Opciones de filtrado y paginación
 * @param {string} keycloakToken - Token de autenticación de Keycloak
 */
export async function fetchLogs({
  page = 1,
  pageSize = 12,
  q = '',
  tipo = 'TODO',
  severidad = 'TODO',
  modulo = 'TODO'
}, keycloakToken) {
  try {
    // Construir parámetros para el endpoint /filtros
    const params = {};

    if (tipo !== 'TODO') params.tipo = tipo;
    if (severidad !== 'TODO') params.severidad = severidad;
    if (modulo !== 'TODO') params.modulo = modulo;

    // Obtener todos los registros filtrados
    const allItems = await fetchWithAuth('/filtros', keycloakToken, params);

    // Filtrar por búsqueda de texto (q) en el frontend
    let filteredItems = allItems;
    if (q) {
      const searchLower = q.toLowerCase();
      filteredItems = allItems.filter(item => {
        const idMatch = item.id?.toString().includes(q);
        const detalleMatch = item.detalle?.toLowerCase().includes(searchLower);
        const usuarioMatch = item.usuario?.toLowerCase().includes(searchLower);
        return idMatch || detalleMatch || usuarioMatch;
      });
    }

    // Aplicar paginación
    const total = filteredItems.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = filteredItems.slice(start, start + pageSize);

    // Formatear items para que coincidan con la estructura esperada
    const formattedItems = items.map(formatAuditoriaItem);

    return { items: formattedItems, total, pages };
  } catch (error) {
    console.error('Error al obtener registros de auditoría:', error);
    // Retornar estructura vacía en caso de error
    return { items: [], total: 0, pages: 1 };
  }
}

/**
 * Obtiene un registro de auditoría por ID
 * Usa el endpoint GET /api/auditoria/{id}
 * @param {string|number} id - ID del registro
 * @param {string} keycloakToken - Token de autenticación de Keycloak
 */
export async function fetchLogById(id, keycloakToken) {
  try {
    const item = await fetchWithAuth(`/${id}`, keycloakToken);
    return formatAuditoriaItem(item);
  } catch (error) {
    console.error(`Error al obtener registro de auditoría ${id}:`, error);
    throw new Error('No se pudo obtener el registro de auditoría');
  }
}

/**
 * Formatea un item de auditoría del backend al formato esperado por el frontend
 * @param {object} item - Item del backend
 */
function formatAuditoriaItem(item) {
  return {
    id: item.id?.toString() || '',
    fecha: item.fecha || new Date().toISOString(),
    tipo: item.tipo || 'UNKNOWN',
    modulo: item.modulo || 'unknown',
    severidad: item.severidad || 'INFO',
    usuario: item.usuario || 'unknown',
    ip: item.ip || '0.0.0.0',
    detalle: item.detalle || 'Sin detalles',
    correlacion: item.correlacion || 'N/A'
  };
}
