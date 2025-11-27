# 🗳️ Guía de Configuración del Backend - Sistema de Votaciones

## ✅ Estado Actual
- ✅ Carpeta `backendBait` creada
- ✅ Estructura de carpetas creada
- ✅ Dependencias de Node.js instaladas
- ⏳ Falta: Configurar credenciales de MongoDB

---

## 📝 PASO 1: Configurar MongoDB Atlas

### 1.1. Obtener el Connection String

Según las imágenes que compartiste, tu connection string es:

```
mongodb+srv://<db_user>:<db_password>@cluster0.gphzalx.mongodb.net/
```

### 1.2. Editar el archivo `.env`

Abre el archivo: `backendBait\.env` y reemplaza:

```env
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.gphzalx.mongodb.net/Dig_elecciones?retryWrites=true&w=majority
```

**Reemplaza:**
- `<db_user>` con tu usuario de MongoDB Atlas
- `<db_password>` con tu contraseña de MongoDB Atlas

**Ejemplo:**
```env
MONGODB_URI=mongodb+srv://admin:MiPassword123@cluster0.gphzalx.mongodb.net/Dig_elecciones?retryWrites=true&w=majority
```

### 1.3. Configurar IP en MongoDB Atlas

⚠️ **IMPORTANTE**: Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas:

1. Ve a MongoDB Atlas → Network Access
2. Click en "Add IP Address"
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0) o agrega tu IP específica

---

## 🚀 PASO 2: Insertar Datos de Candidatos

Una vez configurado el `.env`, ejecuta:

```bash
cd backendBait
npm run seed
```

Esto insertará los candidatos en tu base de datos MongoDB:
- PDC
- Libre
- MAS
- CC
- Creemos

---

## ▶️ PASO 3: Iniciar el Servidor

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en: **http://localhost:5000**

---

## 🔌 PASO 4: Conectar el Frontend

Para que tu frontend en React se conecte al backend, necesitas hacer peticiones HTTP a la API.

### Ejemplo de integración en el frontend:

Modifica `frontend/src/pages/votacion.jsx` para obtener candidatos del backend:

```javascript
import { useState, useEffect } from 'react';

const Votacion = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar candidatos desde el backend
  useEffect(() => {
    const cargarCandidatos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/votaciones/candidatos');
        const data = await response.json();
        if (data.success) {
          setCandidatos(data.data);
        }
      } catch (error) {
        console.error('Error al cargar candidatos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarCandidatos();
  }, []);

  // Función para votar
  const confirmarVoto = async (candidatoId) => {
    try {
      const response = await fetch('http://localhost:5000/api/votaciones/votar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidatoId })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Voto registrado exitosamente para ${data.data.candidato}`);
      }
    } catch (error) {
      console.error('Error al votar:', error);
      alert('Error al registrar el voto');
    }
  };

  // ... resto del componente
};
```

---

## 📡 Endpoints Disponibles

### Obtener candidatos
```http
GET http://localhost:5000/api/votaciones/candidatos
```

**Respuesta:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "nombre": "PDC",
      "descripcion": "Partido Demócrata Cristiano...",
      "partido": "Partido Demócrata Cristiano",
      "imagen": "paz.png",
      "votos": 0,
      "activo": true
    }
  ]
}
```

### Registrar un voto
```http
POST http://localhost:5000/api/votaciones/votar
Content-Type: application/json

{
  "candidatoId": "ID_DEL_CANDIDATO"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Voto registrado exitosamente para PDC",
  "data": {
    "candidato": "PDC",
    "totalVotos": 1,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Ver resultados
```http
GET http://localhost:5000/api/votaciones/resultados
```

### Ver estadísticas
```http
GET http://localhost:5000/api/votaciones/estadisticas
```

---

## 🧪 Probar la API

### Opción 1: Usar el navegador

Abre en tu navegador:
```
http://localhost:5000/api/votaciones/candidatos
```

### Opción 2: Usar cURL (PowerShell)

```powershell
# Obtener candidatos
Invoke-RestMethod -Uri "http://localhost:5000/api/votaciones/candidatos" -Method GET

# Votar (reemplaza ID_DEL_CANDIDATO)
Invoke-RestMethod -Uri "http://localhost:5000/api/votaciones/votar" -Method POST -Body (@{candidatoId="ID_DEL_CANDIDATO"} | ConvertTo-Json) -ContentType "application/json"
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- ✅ Verifica que el `.env` tenga las credenciales correctas
- ✅ Confirma que tu IP esté en la whitelist de MongoDB Atlas
- ✅ Revisa que el cluster esté activo en MongoDB Atlas

### Error: "Port 5000 already in use"
Cambia el puerto en el archivo `.env`:
```env
PORT=3001
```

### CORS Error en el frontend
El backend ya está configurado para aceptar peticiones desde:
- http://localhost:3000
- http://localhost:5173

Si tu frontend usa otro puerto, agrégalo en `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:TU_PUERTO
```

---

## 📂 Estructura Final del Proyecto

```
backendBait/
├── .env                                # ⚙️ Variables de entorno (CONFIGURAR)
├── .gitignore                          # 🚫 Archivos a ignorar
├── package.json                        # 📦 Dependencias
├── README.md                           # 📖 Documentación
├── server.js                           # 🚀 Servidor principal
├── conexion.js                         # 🔌 Conexión a MongoDB
├── node_modules/                       # 📚 Dependencias instaladas
├── scripts/
│   └── seedCandidatos.js              # 🌱 Script para insertar datos
└── services/
    └── votaciones/
        ├── models/
        │   ├── Candidato.js           # 📊 Modelo de Candidato
        │   └── Voto.js                # 🗳️ Modelo de Voto
        ├── controllers/
        │   └── votacionController.js  # 🎮 Lógica de negocio
        └── routes/
            └── votacionRoutes.js      # 🛣️ Rutas HTTP
```

---

## ✨ Próximos Pasos

1. ✅ Configura el archivo `.env` con tus credenciales
2. ✅ Ejecuta `npm run seed` para insertar candidatos
3. ✅ Inicia el servidor con `npm run dev`
4. ✅ Prueba los endpoints en el navegador
5. ✅ Conecta el frontend para que use el backend

---

¡Listo! Tu backend está configurado y listo para funcionar con tu frontend de votaciones. 🎉
