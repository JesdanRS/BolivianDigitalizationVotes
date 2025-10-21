import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Votacion from './pages/votacion';
import AuditoriaDashboard from './pages/auditoria/Dashboard';
import AuditoriaRegistros from './pages/auditoria/Registros';
import ResultadosAuditor from './pages/auditoria/ResultadosAuditor';
import Resultados from './pages/Resultados';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import MiVoto from './pages/MiVoto';
import './App.css';

function App() {
  const miniBar = (
    <div style={{position:'fixed',right:12,bottom:12,background:'#000',color:'#fff',
      padding:'8px 12px',borderRadius:8,opacity:.75,display:'flex',gap:10,zIndex:999}}>
      <Link style={{color:'#fff'}} to="/votacion">Votación</Link>
      <span>•</span>
      <Link style={{color:'#fff'}} to="/resultados">Resultados</Link>
      <span>•</span>
      <Link style={{color:'#fff'}} to="/auditoria">Auditoría</Link>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/votacion" element={<Votacion />} />
        <Route path="/mi-voto" element={<MiVoto />} />
        <Route path="/auditoria" element={<AuditoriaDashboard />} />
        <Route path="/auditoria/registros" element={<AuditoriaRegistros />} />
        <Route path="/auditoria/resultados" element={<ResultadosAuditor />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/ayuda" element={<Resultados />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {miniBar}
    </BrowserRouter>
  );
}
export default App;
