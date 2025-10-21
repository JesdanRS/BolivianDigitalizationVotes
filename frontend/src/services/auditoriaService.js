// src/services/auditoriaService.js

// -------------------- Datos base (mock) --------------------
const tipos = ['LOGIN', 'VOTE_CAST', 'RESULT_PUBLISHED', 'ACTA_REGISTRADA', 'ERROR'];
const modulos = ['usuarios', 'votaciones', 'resultados', 'candidatos', 'auditoria'];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generarLog(id) {
  const tipo = tipos[rand(0, tipos.length - 1)];
  const modulo = modulos[rand(0, modulos.length - 1)];
  const severidad = ['INFO', 'WARN', 'ERROR'][rand(0, 2)];
  const usuario = ['auditor01', 'jmesa12', 'soporte3', 'admin-ti', 'observador'][rand(0, 4)];
  const ahora = Date.now() - rand(0, 1000 * 60 * 60 * 24 * 10); // últimos 10 días

  const detalle =
    tipo === 'VOTE_CAST'
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
    correlacion: 'corr-' + rand(10000, 99999)
  };
}

// -------------------- Persistencia (localStorage) --------------------
const STORAGE_KEY = 'auditoria_cache_v1';

function saveCache(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* noop */ }
}
function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch (e) {
    return null;
  }
}
function syncFromStorage() {
  const s = loadCache();
  if (s) cache = s;
}

// -------------------- Orden estable por fecha desc --------------------
const byFechaDesc = (a, b) => {
  const da = Date.parse(a.fecha) || 0;
  const db = Date.parse(b.fecha) || 0;
  if (db !== da) return db - da; // más reciente primero
  const ia = Number(a.id) || 0;
  const ib = Number(b.id) || 0;
  return ib - ia; // desempate consistente por id
};

// -------------------- Inicialización del cache --------------------
let cache = loadCache();
if (!cache) {
  cache = Array.from({ length: 120 }).map((_, i) => generarLog(i + 1));
  cache.sort(byFechaDesc);
  saveCache(cache);
}

// -------------------- API pública (mocks) --------------------
export function fetchKpis() {
  syncFromStorage(); // asegurar datos más recientes
  const total = cache.length;
  const errores = cache.filter(x => x.severidad === 'ERROR').length;
  const votos = cache.filter(x => x.tipo === 'VOTE_CAST').length;
  const actas = cache.filter(x => x.tipo === 'ACTA_REGISTRADA').length;
  return new Promise(res => setTimeout(() => res({ total, errores, votos, actas }), 300));
}

export function fetchLogs({ page = 1, pageSize = 12, q = '', tipo = 'TODO', severidad = 'TODO', modulo = 'TODO' }) {
  syncFromStorage(); // asegurar datos más recientes

  let data = [...cache];

  // normalización: 'ALL' o 'TODO' significan "sin filtro"
  const tipoNorm = (tipo === 'ALL' || tipo === 'TODO') ? '' : tipo;
  const sevNorm  = (severidad === 'ALL' || severidad === 'TODO') ? '' : severidad;
  const modNorm  = (modulo === 'ALL' || modulo === 'TODO') ? '' : modulo;

  if (q) {
    const ql = q.toLowerCase();
    data = data.filter(x =>
      x.detalle.toLowerCase().includes(ql) ||
      x.usuario.toLowerCase().includes(ql) ||
      String(x.id).includes(q)
    );
  }
  if (tipoNorm) data = data.filter(x => x.tipo === tipoNorm);
  if (sevNorm)  data = data.filter(x => x.severidad === sevNorm);
  if (modNorm)  data = data.filter(x => x.modulo === modNorm);

  data.sort(byFechaDesc);

  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const slice = data.slice(start, start + pageSize);

  return new Promise(res => setTimeout(() => res({ items: slice, total, pages }), 300));
}

export function fetchLogById(id) {
  syncFromStorage();
  const found = cache.find(x => x.id === id);
  return new Promise((res, rej) => setTimeout(() => {
    if (found) res(found); else rej(new Error('No encontrado'));
  }, 200));
}

// -------------------- Alta de eventos (RF06) --------------------
function nextId() {
  const maxId = cache.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0);
  return String(maxId + 1);
}
function nowISO() { return new Date().toISOString(); }
function randomIp() { return `10.0.${rand(0, 255)}.${rand(0, 255)}`; }

export function logEvent({ tipo, modulo, severidad = 'INFO', usuario = 'system', detalle = '', correlacion }) {
  const evt = {
    id: nextId(),
    fecha: nowISO(),
    tipo,
    modulo,
    severidad,
    usuario,
    ip: randomIp(),
    detalle,
    correlacion: correlacion || `corr-${rand(10000, 99999)}`
  };
  cache.unshift(evt);   // último primero
  saveCache(cache);     // persistir para mantener el orden tras recargar
  return evt;
}