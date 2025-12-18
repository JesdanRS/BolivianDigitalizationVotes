import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import Votacion from "./pages/votacion";
import AuditoriaDashboard from "./pages/auditoria/Dashboard";
import AuditoriaRegistros from "./pages/auditoria/Registros";
import ResultadosAuditor from "./pages/auditoria/ResultadosAuditor";
import Resultados from "./pages/Resultados";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import GestionCandidatos from "./pages/GestionCandidatos";
import MiVoto from "./pages/MiVoto";
import JuradoEspera from "./pages/JuradoEspera";
import "./App.css";

// Componente para redirección basada en roles
function RoleBasedRedirect() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Cargando...</div>
    );
  }

  // Verificar roles del usuario
  const hasVotanteRole =
    keycloak?.hasRealmRole?.("votante") || keycloak?.hasRealmRole?.("USER");
  const hasAuditorRole =
    keycloak?.hasRealmRole?.("auditor") || keycloak?.hasRealmRole?.("ADMIN");

  // Redirigir según el rol
  if (hasVotanteRole) {
    return <Navigate to="/votacion" replace />;
  } else if (hasAuditorRole) {
    return <Navigate to="/auditoria" replace />;
  }

  // Por defecto, redirigir a votación si no hay roles específicos o si es un usuario nuevo
  return <Navigate to="/votacion" replace />;
}

function App() {
  const miniBar = (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        background: "#000",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 8,
        opacity: 0.75,
        display: "flex",
        gap: 10,
        zIndex: 999,
      }}
    >
      <Link style={{ color: "#fff" }} to="/votacion">
        Votación
      </Link>
      <span>•</span>
      <Link style={{ color: "#fff" }} to="/resultados">
        Resultados
      </Link>
      <span>•</span>
      <Link style={{ color: "#fff" }} to="/auditoria">
        Auditoría
      </Link>
      <Link style={{ color: "#fff" }} to="/gestionar-candidatos">
        Gestionar
      </Link>
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
        <Route path="/gestionar-candidatos" element={<GestionCandidatos />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/ayuda" element={<Resultados />} />
        <Route path="/jurado-espera" element={<JuradoEspera />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {miniBar}
    </BrowserRouter>
  );
}
export default App;
