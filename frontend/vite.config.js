// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ms-candidatos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // NUEVO: todo lo que empiece con /realms va a Keycloak (8090)
      '/realms': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
})
