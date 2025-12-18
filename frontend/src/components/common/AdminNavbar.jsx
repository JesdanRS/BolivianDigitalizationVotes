import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    logout();
    authLogout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#000000",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="/src/assets/images/example.png"
          alt="Elecciones Bolivia"
          style={{ height: "24px", marginRight: "8px" }}
        />
        Elecciones Bolivia - Administración
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/admin/gestionar-usuarios"
          style={{
            color:
              location.pathname === "/admin/gestionar-usuarios"
                ? "#dc2626"
                : "#666",
            textDecoration: "none",
            fontWeight:
              location.pathname === "/admin/gestionar-usuarios"
                ? "bold"
                : "normal",
          }}
        >
          Gestión de Usuarios
        </Link>
        <Link
          to="/admin/gestionar-candidatos"
          style={{
            color:
              location.pathname === "/admin/gestionar-candidatos"
                ? "#dc2626"
                : "#666",
            textDecoration: "none",
            fontWeight:
              location.pathname === "/admin/gestionar-candidatos"
                ? "bold"
                : "normal",
          }}
        >
          Gestión de Candidatos
        </Link>
        <Link
          to="/admin/registros"
          style={{
            color:
              location.pathname === "/admin/registros" ? "#dc2626" : "#666",
            textDecoration: "none",
            fontWeight:
              location.pathname === "/admin/registros" ? "bold" : "normal",
          }}
        >
          Registros
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginRight: "30px",
        }}
      >
        <span>ES</span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "8px 15px",
            borderRadius: "4px",
            border: "none",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
