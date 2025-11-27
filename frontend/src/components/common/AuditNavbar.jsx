import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Item = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} style={{
      padding:'10px 14px',
      borderRadius:10,
      backgroundColor: active ? '#eef2ff' : 'transparent',
      color: active ? '#1f2937' : '#4b5563',
      textDecoration:'none', fontWeight:500
    }}>
      {label}
    </Link>
  );
};

const AuditNavbar = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  
  const handleLogout = () => {
    logout();
    authLogout();
    navigate('/login');
  };
  
  return (
    <nav style={{
      display:'flex',justifyContent:'space-between',alignItems:'center',
      padding:'12px 24px',background:'#fff',borderBottom:'1px solid #e5e7eb',
      position:'sticky',top:0,zIndex:50
    }}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{fontSize:'1.4rem',fontWeight:800,color:'#111'}}>VotoSeguro</div>
        <div style={{fontSize:12,color:'#6b7280',marginTop:2}}>· Auditoría</div>
      </div>

      <div style={{display:'flex',gap:6}}>
        <Item to="/auditoria" label="Dashboard" />
        <Item to="/auditoria/resultados" label="Resultados" />
        <Item to="/auditoria/registros" label="Registros" />
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:12,color:'#6b7280'}}>Auditor</span>
        <div style={{width:32,height:32,borderRadius:'50%',background:'#c7d2fe'}} />
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            border: 'none',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 'bold',
            marginLeft: '10px',
            cursor: 'pointer'
          }}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};
export default AuditNavbar;
