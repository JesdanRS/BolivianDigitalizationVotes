import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Votacion from './pages/votacion';
import AuditoriaDashboard from './pages/auditoria/Dashboard';
import AuditoriaRegistros from './pages/auditoria/Registros';
import ResultadosAuditor from './pages/auditoria/ResultadosAuditor';
import Resultados from './pages/Resultados';
import GestionCandidatos from './pages/GestionCandidatos';
import './App.css';

function App() {
  const miniBar = (
    <div style={{position:'fixed',right:12,bottom:12,background:'#000',color:'#fff',
      padding:'8px 12px',borderRadius:8,opacity:.75,display:'flex',gap:10,zIndex:999}}>
      <Link style={{color:'#fff'}} to="/">Votación</Link>
      <span>•</span>
      <Link style={{color:'#fff'}} to="/resultados">Resultados</Link>
      <span>•</span>
      <Link style={{color:'#fff'}} to="/auditoria">Auditoría</Link>
      <span>•</span>
      <Link style={{color:'#fff'}} to="/gestionar-candidatos">Gestionar Candidatos</Link>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Votacion />} />
        <Route path="/auditoria" element={<AuditoriaDashboard />} />
        <Route path="/auditoria/registros" element={<AuditoriaRegistros />} />
        <Route path="/auditoria/resultados" element={<ResultadosAuditor />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/gestionar-candidatos" element={<GestionCandidatos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {miniBar}
    </BrowserRouter>
  );
}
export default App;
