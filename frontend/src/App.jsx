// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Votacion from './pages/votacion';
import AuditoriaDashboard from './pages/auditoria/Dashboard';
import AuditoriaRegistros from './pages/auditoria/Registros';
import ResultadosAuditor from './pages/auditoria/ResultadosAuditor';
import Resultados from './pages/Resultados';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import MiVoto from './pages/MiVoto';
import GestionCandidatos from './pages/GestionCandidatos';
import GestionUsuarios from './pages/GestionUsuarios';
import JuradoEspera from './pages/JuradoEspera';
import './App.css';

function App() {
  const miniBar = (
    <div
      style={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        background: '#000',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 8,
        opacity: 0.75,
        display: 'flex',
        gap: 10,
        zIndex: 999,
      }}
    >
      <Link style={{ color: '#fff' }} to="/votacion">Votación</Link>
      <span>•</span>
      <Link style={{ color: '#fff' }} to="/resultados">Resultados</Link>
      <span>•</span>
      <Link style={{ color: '#fff' }} to="/auditoria">Auditoría</Link>
      <span>•</span>
      <Link style={{ color: '#fff' }} to="/gestionar-candidatos">Gestionar Candidatos</Link>
      <span>•</span>
      <Link style={{ color: '#fff' }} to="/gestionar-usuarios">Gestionar Usuarios</Link>
    </div>
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicos */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Votante: requiere rol técnico USER */}
          <Route
            path="/votacion"
            element={
              <ProtectedRoute requiredRole="USER">
                <Votacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mi-voto"
            element={
              <ProtectedRoute requiredRole="USER">
                <MiVoto />
              </ProtectedRoute>
            }
          />

          {/* Auditoría: auditor o admin */}
          <Route
            path="/auditoria"
            element={
              <ProtectedRoute allowedRoles={['auditor', 'admin']}>
                <AuditoriaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auditoria/registros"
            element={
              <ProtectedRoute allowedRoles={['auditor', 'admin']}>
                <AuditoriaRegistros />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auditoria/resultados"
            element={
              <ProtectedRoute allowedRoles={['auditor', 'admin']}>
                <ResultadosAuditor />
              </ProtectedRoute>
            }
          />

          {/* Resultados/ayuda: solo sesión activa, sin rol específico */}
          <Route
            path="/resultados"
            element={
              <ProtectedRoute>
                <Resultados />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ayuda"
            element={
              <ProtectedRoute>
                <Resultados />
              </ProtectedRoute>
            }
          />

          {/* Administración: solo admin */}
          <Route
            path="/gestionar-candidatos"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <GestionCandidatos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-usuarios"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <GestionUsuarios />
              </ProtectedRoute>
            }
          />

          {/* Jurado: rol jurado (definido en frontend) */}
          <Route
            path="/jurado-espera"
            element={
              <ProtectedRoute allowedRoles={['jurado']}>
                <JuradoEspera />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        {miniBar}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
