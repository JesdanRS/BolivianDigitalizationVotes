import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DebugNavBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Votación", path: "/votacion", icon: "🗳️", color: "#dc2626" },
    { label: "Mi Voto", path: "/mi-voto", icon: "🎫", color: "#2563eb" },
    { label: "Resultados", path: "/resultados", icon: "📊", color: "#059669" },
    { label: "Auditoría", path: "/auditoria", icon: "📋", color: "#7c3aed" },
    {
      label: "Gestionar Usuarios",
      path: "/admin/gestionar-usuarios",
      icon: "👥",
      color: "#f59e0b",
    },
    {
      label: "Gestionar Candidatos",
      path: "/admin/gestionar-candidatos",
      icon: "🗳️",
      color: "#ec4899",
    },
    {
      label: "Registros Admin",
      path: "/admin/registros",
      icon: "📝",
      color: "#10b981",
    },
    { label: "Jurado", path: "/jurado-espera", icon: "👨‍⚖️", color: "#6366f1" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      {/* Botones expandidos */}
      {isExpanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            background: "rgba(17, 24, 39, 0.95)",
            borderRadius: "12px",
            padding: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "4px",
              opacity: 0.7,
              textAlign: "center",
            }}
          >
            DEBUG NAVIGATION
          </div>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsExpanded(false);
              }}
              style={{
                background: item.color,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: "180px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(0, 0, 0, 0.2)";
              }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Botón toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: isExpanded ? "#ef4444" : "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        }}
      >
        {isExpanded ? "✕" : "🚀"}
      </button>
    </div>
  );
};

export default DebugNavBar;
