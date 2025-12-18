import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import Votacion from "./pages/votacion";
import AuditoriaDashboard from "./pages/auditoria/Dashboard";
import AuditoriaRegistros from "./pages/auditoria/Registros";
import ResultadosAuditor from "./pages/auditoria/ResultadosAuditor";
import Resultados from "./pages/Resultados";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import GestionCandidatos from "./pages/admin/GestionCandidatos";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import RegistrosAdmin from "./pages/admin/RegistrosAdmin";
import MiVoto from "./pages/MiVoto";
import JuradoEspera from "./pages/JuradoEspera";
import DebugNavBar from "./components/common/DebugNavBar";
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
        <Route
          path="/admin/gestionar-candidatos"
          element={<GestionCandidatos />}
        />
        <Route path="/admin/gestionar-usuarios" element={<GestionUsuarios />} />
        <Route path="/admin/registros" element={<RegistrosAdmin />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/ayuda" element={<Resultados />} />
        <Route path="/jurado-espera" element={<JuradoEspera />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <DebugNavBar />
    </BrowserRouter>
  );
}
export default App;
