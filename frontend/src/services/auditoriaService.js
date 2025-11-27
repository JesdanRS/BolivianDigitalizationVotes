// src/services/auditoriaService.js
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
 * Obtiene resumen general de KPIs desde backend
 */
export const obtenerKpis = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/kpis');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper de normalización para búsquedas y mapping de “anónimo”
const normalizeText = (txt) =>
  (txt ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim();

/**
 * Filtra registros con múltiples criterios
 * @param {Object} filtros - {tipo, severidad, modulo, usuario, inicio, fin}
 */
export const filtrar = async (filtros) => {
  try {
    const params = new URLSearchParams();

    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.severidad) params.append('severidad', filtros.severidad);
    if (filtros.modulo) params.append('modulo', filtros.modulo);

    if (filtros.usuario) {
      const normUser = normalizeText(filtros.usuario);
      const value = normUser === 'anonimo' ? '00000000' : filtros.usuario;
      params.append('usuario', value);
    }

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
 */
export const exportarCSV = async () => {
  try {
    const response = await apiClient.get('/api/auditoria/formatoCsv');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ========== DATOS SIMULADOS (fallback) ==========
const tiposMock = [
  'LOGIN',
  'LOGIN_FALLIDO',
  'SOLICITAR_CODIGO',
  'SOLICITAR_CODIGO_FALLIDO',
  'VERIFICAR_CODIGO_OK',
  'VERIFICAR_CODIGO_FALLIDO',
  'CARGA_MASIVA_USUARIOS',
  'VOTO_EMITIDO',
  'CREAR_CANDIDATO',
  'ACTUALIZAR_CANDIDATO',
  'ELIMINAR_CANDIDATO',
  'CONSULTA',
  'ELIMINACION',
  'ERROR',
];
const modulosMock = [
  'usuarios',
  'votaciones',
  'resultados',
  'candidatos',
  'auditoria',
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarLogMock(id) {
  const tipo = tiposMock[rand(0, tiposMock.length - 1)];
  const modulo = modulosMock[rand(0, tiposMock.length - 1)];
  const severidad = ['INFO', 'WARN', 'ERROR', 'CRITICAL'][rand(0, 3)];
  const usuario = ['auditor01', 'jmesa12', 'soporte3', 'admin-ti', 'observador'][rand(0, 4)];
  const ahora = Date.now() - rand(0, 1000 * 60 * 60 * 24 * 10);

  const detalle =
    tipo === 'VOTO_EMITIDO'
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
    tipo,
    modulo,
    severidad,
    usuario,
    ip: `10.0.${rand(0, 255)}.${rand(0, 255)}`,
    detalle,
    correlacion: 'corr-' + rand(10000, 99999),
  };
}

let cacheMock = Array.from({ length: 120 }).map((_, i) => generarLogMock(i + 1));

// Orden global por fecha desc (últimos primero)
const sortByFechaDesc = (a, b) => {
  const da = a.fecha ? new Date(a.fecha).getTime() : 0;
  const db = b.fecha ? new Date(b.fecha).getTime() : 0;
  if (db !== da) return db - da;
  return (b.id ?? 0) - (a.id ?? 0);
};

/**
 * Wrapper para el Dashboard: intenta backend, si falla usa mock.
 */
export async function fetchKpis() {
  const numOr = (raw, keys, fallbackFn) => {
    if (!raw) return 0;

    // Intenta propiedades directas
    for (const k of keys) {
      if (k in raw) {
        const n = Number(raw[k]);
        if (!Number.isNaN(n)) return n;
      }
    }

    // Fallback específico (porTipo, porSeveridad, etc.)
    if (fallbackFn) {
      const n = fallbackFn(raw);
      if (typeof n === 'number' && !Number.isNaN(n)) return n;
    }

    return 0;
  };

  try {
    const raw = await obtenerKpis();
    console.debug('KPIs backend', raw);

    // TOTAL EVENTOS
    const total = numOr(
      raw,
      ['total', 'totalEventos', 'eventosTotales', 'cantidadEventos', 'totalRegistros'],
      (r) => {
        if (Array.isArray(r.porTipo)) {
          return r.porTipo.reduce((acc, it) => {
            const v = Number(it.cantidad ?? it.total ?? it.valor ?? 0);
            return acc + (Number.isNaN(v) ? 0 : v);
          }, 0);
        }
        if (r.porTipo && typeof r.porTipo === 'object') {
          return Object.values(r.porTipo).reduce((acc, val) => {
            const v = Number(val);
            return acc + (Number.isNaN(v) ? 0 : v);
          }, 0);
        }
        return 0;
      }
    );

    // ERRORES
    const errores = numOr(
      raw,
      ['errores', 'totalErrores', 'erroresTotales', 'errorCount'],
      (r) => {
        if (Array.isArray(r.porSeveridad)) {
          const err = r.porSeveridad.find(
            (it) =>
              (it.severidad ?? it.nivel ?? '').toString().toUpperCase() === 'ERROR'
          );
          if (err) {
            return Number(err.cantidad ?? err.total ?? err.valor ?? 0);
          }
        }
        if (r.porSeveridad && typeof r.porSeveridad === 'object') {
          const v = r.porSeveridad.ERROR ?? r.porSeveridad.error;
          if (v != null) return Number(v);
        }
        return 0;
      }
    );

    // VOTOS REGISTRADOS
    const votos = numOr(
      raw,
      ['votos', 'votosRegistrados', 'votosEmitidos', 'totalVotosEmitidos'],
      (r) => {
        if (Array.isArray(r.porTipo)) {
          const votoItem = r.porTipo.find((it) => {
            const t = (it.tipo ?? it.clave ?? '').toString().toUpperCase();
            return t === 'VOTO_EMITIDO' || t === 'VOTE_CAST';
          });
          if (votoItem) {
            return Number(
              votoItem.cantidad ?? votoItem.total ?? votoItem.valor ?? 0
            );
          }
        }
        if (r.porTipo && typeof r.porTipo === 'object') {
          const v =
            r.porTipo.VOTO_EMITIDO ??
            r.porTipo.VOTE_CAST ??
            r.porTipo['Voto emitido'] ??
            r.porTipo['VOTE_EMITIDO'];
          if (v != null) return Number(v);
        }
        return 0;
      }
    );

    // ACTAS (si algún día lo agregan)
    const actas = numOr(
      raw,
      ['actas', 'actasRegistradas', 'totalActasRegistradas'],
      (r) => {
        if (Array.isArray(r.porTipo)) {
          const actaItem = r.porTipo.find((it) => {
            const t = (it.tipo ?? it.clave ?? '').toString().toUpperCase();
            return t === 'ACTA_REGISTRADA';
          });
          if (actaItem) {
            return Number(
              actaItem.cantidad ?? actaItem.total ?? actaItem.valor ?? 0
            );
          }
        }
        if (r.porTipo && typeof r.porTipo === 'object') {
          const v = r.porTipo.ACTA_REGISTRADA;
          if (v != null) return Number(v);
        }
        return 0;
      }
    );

    return { total, errores, votos, actas };
  } catch (error) {
    console.error('Error al obtener KPIs del backend, usando datos simulados', error);

    const total = cacheMock.length;
    const errores = cacheMock.filter((x) => x.severidad === 'ERROR').length;
    const votos = cacheMock.filter((x) => x.tipo === 'VOTO_EMITIDO').length;
    const actas = cacheMock.filter((x) => x.tipo === 'ACTA_REGISTRADA').length;

    return { total, errores, votos, actas };
  }
}

/**
 * Wrapper para lista de logs con paginación en frontend.
 * inicio: fecha inicio (inclusiva)
 * fin:    fecha final seleccionada por el usuario (inclusiva) → se envía al backend como +1 día (rango [inicio, fin) )
 */
export async function fetchLogs({
  page = 1,
  pageSize = 12,
  q = '',
  tipo = 'TODO',
  severidad = 'TODO',
  modulo = 'TODO',
  inicio,
  fin,
}) {
  try {
    let data;

    const usarFiltros =
      (tipo && tipo !== 'TODO') ||
      (severidad && severidad !== 'TODO') ||
      (modulo && modulo !== 'TODO') ||
      !!inicio ||
      !!fin;

    if (!usarFiltros) {
      // sin filtros → trae todos
      data = await obtenerRegistros();
    } else {
      const filtros = {};
      if (tipo && tipo !== 'TODO') filtros.tipo = tipo;
      if (severidad && severidad !== 'TODO') filtros.severidad = severidad;
      if (modulo && modulo !== 'TODO') filtros.modulo = modulo;
      if (inicio) filtros.inicio = inicio;

      if (fin) {
        // El backend interpreta fin como exclusivo → enviamos (fin + 1 día)
        const d = new Date(`${fin}T00:00:00`);
        d.setDate(d.getDate() + 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        filtros.fin = `${y}-${m}-${day}`;
      }

      data = await filtrar(filtros);
    }

    let filtered = [...data];

    if (q) {
      const qNorm = normalizeText(q);

      filtered = filtered.filter((x) => {
        const detalleNorm = normalizeText(x.detalle);
        const corrNorm = normalizeText(x.correlacion);
        const idStr = String(x.id ?? '');
        const usuarioNorm =
          x.usuario === '00000000'
            ? 'anonimo'
            : normalizeText(x.usuario);

        return (
          detalleNorm.includes(qNorm) ||
          usuarioNorm.includes(qNorm) ||
          idStr.includes(qNorm) ||
          corrNorm.includes(qNorm)
        );
      });
    }

    // Orden global por fecha desc ANTES de paginar
    filtered.sort(sortByFechaDesc);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);

    return { items: slice, total, pages };
  } catch (error) {
    console.error('Error al obtener logs del backend, usando datos simulados', error);

    // Fallback mock (incluye filtro de fechas inclusivo)
    let data = [...cacheMock];

    if (inicio) {
      const tInicio = new Date(inicio).getTime();
      data = data.filter((x) => new Date(x.fecha).getTime() >= tInicio);
    }
    if (fin) {
      // En fallback tomamos fin como inclusivo directo
      const tFin = new Date(fin).getTime();
      data = data.filter((x) => new Date(x.fecha).getTime() <= tFin);
    }

    if (q) {
      const qNorm = normalizeText(q);

      data = data.filter((x) => {
        const detalleNorm = normalizeText(x.detalle);
        const idStr = String(x.id ?? '');
        const usuarioNorm =
          x.usuario === '00000000'
            ? 'anonimo'
            : normalizeText(x.usuario);

        return (
          detalleNorm.includes(qNorm) ||
          usuarioNorm.includes(qNorm) ||
          idStr.includes(qNorm)
        );
      });
    }

    if (tipo !== 'TODO') data = data.filter((x) => x.tipo === tipo);
    if (severidad !== 'TODO') data = data.filter((x) => x.severidad === severidad);
    if (modulo !== 'TODO') data = data.filter((x) => x.modulo === modulo);

    // También aquí: últimos primero
    data.sort(sortByFechaDesc);

    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const slice = data.slice(start, start + pageSize);

    return { items: slice, total, pages };
  }
}

/**
 * Wrapper para detalle de log.
 */
export async function fetchLogById(id) {
  try {
    const registro = await obtenerPorId(id);
    return registro;
  } catch (error) {
    console.error('Error al obtener log por ID del backend, usando datos simulados', error);
    const found = cacheMock.find((x) => String(x.id) === String(id));
    if (!found) throw new Error('Registro no encontrado');
    return found;
  }
}