import { Link, useLocation } from 'react-router-dom';
import React from 'react';

const AdminNavbar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: "/gestionar-candidatos", label: "Candidatos", icon: "🗳️" },
    { to: "/gestionar-usuarios", label: "Usuarios", icon: "👥" },
    { to: "/cargar-votos", label: "Cargar Votos", icon: "⬆️" },
    { to: "/estadisticas", label: "Estadísticas", icon: "📊" }
  ];

  return (
    <nav style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'12px 24px', background:'#fff', borderBottom:'1px solid #e5e7eb',
      position:'sticky', top:0, zIndex:50
    }}>
      <div style={{fontWeight:700, fontSize:'1.3rem'}}>VotoSeguro · Admin</div>

      <div style={{display:'flex', gap:12}}>
        {links.map(link => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding:'8px 14px',
                borderRadius:10,
                backgroundColor: active ? '#dc2626' : '#f3f4f6',
                color: active ? 'white' : '#374151',
                textDecoration:'none',
                fontWeight:500
              }}
            >
              {link.icon} {link.label}
            </Link>
          );
        })}
      </div>

      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <span style={{fontSize:12, color:'#6b7280'}}>Administrador</span>
        <div style={{width:32, height:32, borderRadius:'50%', background:'#c7d2fe'}}></div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
