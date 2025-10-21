import React, { useEffect, useState } from 'react';
import AuditNavbar from '../../components/common/AuditNavbar';
import LogTable from '../../components/auditoria/LogTable';
import LogDetailModal from '../../components/auditoria/LogDetailModal';
import { fetchLogs, fetchLogById } from '../../services/auditoriaService';

const Select = props => <select {...props} style={{padding:'10px 12px',border:'1px solid #e5e7eb',
  borderRadius:10, background:'#fff'}}/>;
const Input = props => <input {...props} style={{padding:'10px 12px',border:'1px solid #e5e7eb',
  borderRadius:10,width:260}}/>;
const Button = props => <button {...props} style={{padding:'10px 14px',borderRadius:10,border:'1px solid #e5e7eb',
  background:'#111', color:'#fff', cursor:'pointer'}}/>;

const Registros = () => {
  const [q,setQ]=useState('');
  const [tipo,setTipo]=useState('TODO');
  const [sev,setSev]=useState('TODO');
  const [mod,setMod]=useState('TODO');
  const [page,setPage]=useState(1);
  const [data,setData]=useState({items:[], total:0, pages:1});

  const [open,setOpen]=useState(false);
  const [selected,setSelected]=useState(null);

  const load = () => fetchLogs({page, q, tipo, severidad:sev, modulo:mod}).then(setData);

  useEffect(()=>{ load(); /* eslint-disable-next-line */ },[page]);

  const onSearch=(e)=>{ e.preventDefault(); setPage(1); load(); };

  const handleView = async (item) => {
    setOpen(true);
    setSelected(null);
    const full = await fetchLogById(item.id);
    setSelected(full);
  };

  return (
    <div style={{fontFamily:'Arial, sans-serif',background:'#f9fafb'}}>
      <AuditNavbar />
      <div style={{padding:'24px 40px', width:'95%', maxWidth:'100%', margin:0}}>
        <h1 style={{fontSize:'1.6rem',fontWeight:800,marginBottom:16}}>Registros del Sistema</h1>

        <form onSubmit={onSearch} style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}>
          <Input placeholder="Buscar (id, usuario, detalle...)" value={q} onChange={e=>setQ(e.target.value)} />
          <Select value={tipo} onChange={e=>setTipo(e.target.value)}>
            {['TODO','LOGIN','VOTE_CAST','RESULT_PUBLISHED','ACTA_REGISTRADA','ERROR'].map(v=><option key={v}>{v}</option>)}
          </Select>
          <Select value={sev} onChange={e=>setSev(e.target.value)}>
            {['TODO','INFO','WARN','ERROR'].map(v=><option key={v}>{v}</option>)}
          </Select>
          <Select value={mod} onChange={e=>setMod(e.target.value)}>
            {['TODO','usuarios','votaciones','resultados','candidatos','auditoria'].map(v=><option key={v}>{v}</option>)}
          </Select>
          <Button type="submit">Filtrar</Button>
        </form>

        <LogTable items={data.items} onView={handleView} />

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
          <div style={{color:'#6b7280',fontSize:12}}>Total: {data.total}</div>
          <div style={{display:'flex',gap:8}}>
            <Button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Anterior</Button>
            <div style={{padding:'10px 12px',border:'1px solid #e5e7eb',borderRadius:10,background:'#fff'}}>
              Página {page} de {data.pages}
            </div>
            <Button onClick={()=>setPage(p=>Math.min(data.pages,p+1))} disabled={page===data.pages}>Siguiente</Button>
          </div>
        </div>
      </div>

      <LogDetailModal open={open} onClose={()=>setOpen(false)} log={selected} />
    </div>
  );
};
export default Registros;
