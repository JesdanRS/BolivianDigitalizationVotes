import React, { useEffect, useState } from 'react';
import AuditNavbar from '../../components/common/AuditNavbar';
import StatCard from '../../components/auditoria/StatCard';
import { fetchKpis, fetchLogs, fetchLogById } from '../../services/auditoriaService';
import LogTable from '../../components/auditoria/LogTable';
import LogDetailModal from '../../components/auditoria/LogDetailModal';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [kpis, setKpis] = useState({total:0, errores:0, votos:0, actas:0});
  const [recent, setRecent] = useState([]);
  const [open,setOpen]=useState(false);
  const [selected,setSelected]=useState(null);

  useEffect(()=>{
    fetchKpis().then(setKpis);
    fetchLogs({page:1,pageSize:6}).then(r=>setRecent(r.items));
  },[]);

  const handleView = async (item) => {
    setOpen(true);
    setSelected(null);
    const full = await fetchLogById(item.id);
    setSelected(full);
  };

  return (
    <div style={{fontFamily:'Arial, sans-serif',background:'#f9fafb',minHeight:'100dvh',color:'#111'}}>
      <AuditNavbar />

      <div style={{padding:'24px 40px', width:'95%', maxWidth:'100%', margin:0}}>
        <h1 style={{fontSize:'1.8rem',fontWeight:800,marginBottom:16}}>Panel de Auditoría</h1>
        <p style={{color:'#6b7280',marginBottom:24}}>
          Visión general de eventos, actividad reciente y accesos.
        </p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4, minmax(0, 1fr))',gap:14,marginBottom:24}}>
          <StatCard label="Eventos totales" value={kpis.total} />
          <StatCard label="Errores" value={kpis.errores} />
          <StatCard label="Votos registrados" value={kpis.votos} />
          <StatCard label="Actas registradas" value={kpis.actas} />
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <h2 style={{fontSize:'1.2rem',fontWeight:700}}>Actividad reciente</h2>
          <Link to="/auditoria/registros" style={{color:'#2563eb',textDecoration:'none'}}>Ver todos los registros →</Link>
        </div>
        <LogTable items={recent} onView={handleView} />
      </div>

      <LogDetailModal open={open} onClose={()=>setOpen(false)} log={selected} />
    </div>
  );
};
export default Dashboard;