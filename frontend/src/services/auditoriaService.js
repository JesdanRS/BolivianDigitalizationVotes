// Simula datos de auditoría sin backend.
const tipos = ['LOGIN','VOTE_CAST','RESULT_PUBLISHED','ACTA_REGISTRADA','ERROR'];
const modulos = ['usuarios','votaciones','resultados','candidatos','auditoria'];

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function generarLog(id){
  const tipo = tipos[rand(0, tipos.length-1)];
  const modulo = modulos[rand(0, modulos.length-1)];
  const severidad = ['INFO','WARN','ERROR'][rand(0,2)];
  const usuario = ['auditor01','jmesa12','soporte3','admin-ti','observador'][rand(0,4)];
  const ahora = Date.now() - rand(0, 1000*60*60*24*10); // últimos 10 días
  const detalle = tipo === 'VOTE_CAST'
    ? 'Registro de voto (hash=0x' + rand(1000,9999).toString(16) + ')'
    : tipo === 'RESULT_PUBLISHED'
      ? 'Publicación de parcial oficial'
      : tipo === 'ACTA_REGISTRADA'
        ? 'Acta #'+rand(100,999)+' registrada y firmada'
        : tipo === 'LOGIN'
          ? 'Inicio de sesión satisfactorio'
          : 'Excepción en pipeline de resultados';

  return {
    id: id.toString(),
    fecha: new Date(ahora).toISOString(),
    tipo, modulo, severidad, usuario, ip:`10.0.${rand(0,255)}.${rand(0,255)}`,
    detalle, correlacion:'corr-'+rand(10000,99999)
  };
}

let cache = Array.from({length:120}).map((_,i)=>generarLog(i+1));

export function fetchKpis(){
  // KPIs simples sobre el cache
  const total = cache.length;
  const errores = cache.filter(x=>x.severidad==='ERROR').length;
  const votos = cache.filter(x=>x.tipo==='VOTE_CAST').length;
  const actas = cache.filter(x=>x.tipo==='ACTA_REGISTRADA').length;
  return new Promise(res=>setTimeout(()=>res({total, errores, votos, actas}), 300));
}

export function fetchLogs({page=1,pageSize=12, q='', tipo='TODO', severidad='TODO', modulo='TODO'}){
  let data = [...cache];
  if(q) data = data.filter(x =>
    x.detalle.toLowerCase().includes(q.toLowerCase()) ||
    x.usuario.toLowerCase().includes(q.toLowerCase()) ||
    x.id.includes(q)
  );
  if(tipo!=='TODO') data = data.filter(x=>x.tipo===tipo);
  if(severidad!=='TODO') data = data.filter(x=>x.severidad===severidad);
  if(modulo!=='TODO') data = data.filter(x=>x.modulo===modulo);

  const total = data.length;
  const pages = Math.max(1, Math.ceil(total/pageSize));
  const start = (page-1)*pageSize;
  const slice = data.slice(start, start+pageSize);
  return new Promise(res=>setTimeout(()=>res({items:slice, total, pages}), 300));
}

export function fetchLogById(id){
  const found = cache.find(x=>x.id===id);
  return new Promise((res,rej)=>setTimeout(()=>{
    if(found) res(found); else rej(new Error('No encontrado'));
  }, 200));
}
