import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "login-required", // Forzar login con Keycloak
      pkceMethod: "S256",
      checkLoginIframe: false,
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </ReactKeycloakProvider>
);
