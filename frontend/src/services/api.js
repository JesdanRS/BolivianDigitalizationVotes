import axios from "axios";
import keycloak from "../keycloak";

const api = axios.create({
  baseURL: "http://localhost:8080", // API Gateway
  timeout: 10000,
});

// Interceptor para agregar token en cada request
api.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
      console.log("🔑 Token enviado al Gateway");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 Token expirado, intentando renovar...");
      try {
        await keycloak.updateToken(30);
        // Reintentar request original con nuevo token
        error.config.headers.Authorization = `Bearer ${keycloak.token}`;
        return api.request(error.config);
      } catch (err) {
        console.log("⛔ No se pudo renovar token, redirigiendo a login");
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
