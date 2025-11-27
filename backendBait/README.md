# Backend Bait - Sistema de Votaciones

Backend para el sistema de votaciones digitales de Bolivia usando Node.js, Express y MongoDB Atlas.

## 📋 Estructura del Proyecto

```
backendBait/
├── conexion.js                          # Configuración de conexión a MongoDB
├── server.js                            # Servidor principal Express
├── package.json                         # Dependencias del proyecto
├── .env.example                         # Ejemplo de variables de entorno
├── services/
│   └── votaciones/
│       ├── models/
│       │   ├── Candidato.js            # Modelo de Candidato
│       │   └── Voto.js                 # Modelo de Voto
│       ├── controllers/
│       │   └── votacionController.js   # Controladores de votación
│       └── routes/
│           └── votacionRoutes.js       # Rutas de la API
└── scripts/
    └── seedCandidatos.js               # Script para insertar candidatos
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd backendBait
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de MongoDB Atlas:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<tu-usuario>:<tu-password>@cluster0.gphzalx.mongodb.net/Dig_elecciones?retryWrites=true&w=majority
```

**IMPORTANTE**: Reemplaza `<tu-usuario>` y `<tu-password>` con tus credenciales reales de MongoDB Atlas.

### 3. Insertar datos de candidatos

Ejecuta el script de seed para insertar candidatos en la base de datos:

```bash
npm run seed
```

### 4. Iniciar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

## 📡 Endpoints de la API

### Candidatos

- **GET** `/api/votaciones/candidatos` - Obtener todos los candidatos activos
- **GET** `/api/votaciones/candidatos/:id` - Obtener un candidato específico

### Votación

- **POST** `/api/votaciones/votar` - Registrar un voto
  ```json
  {
    "candidatoId": "id_del_candidato"
  }
  ```

### Resultados

- **GET** `/api/votaciones/resultados` - Obtener resultados de votación
- **GET** `/api/votaciones/estadisticas` - Obtener estadísticas generales

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB
- **CORS** - Manejo de peticiones cross-origin
- **Helmet** - Seguridad HTTP
- **Morgan** - Logger de peticiones

## 📊 Modelos de Datos

### Candidato
```javascript
{
  nombre: String,
  descripcion: String,
  partido: String,
  imagen: String,
  votos: Number,
  activo: Boolean,
  fechaRegistro: Date
}
```

### Voto
```javascript
{
  candidatoId: ObjectId,
  candidatoNombre: String,
  usuarioId: String,
  ipAddress: String,
  userAgent: String,
  fechaVoto: Date,
  validado: Boolean
}
```

## 🔐 Seguridad

- CORS configurado para permitir solo orígenes específicos
- Helmet para headers de seguridad HTTP
- Validación de datos en controladores
- Registro de votos con metadata para auditoría

## 🐛 Troubleshooting

### Error de conexión a MongoDB

Si obtienes un error de conexión:
1. Verifica que tu IP esté en la whitelist de MongoDB Atlas
2. Confirma que tus credenciales sean correctas
3. Verifica que el string de conexión esté bien formado

### Puerto en uso

Si el puerto 5000 está ocupado, cámbialo en el archivo `.env`:
```env
PORT=3001
```

## 📝 Notas

- Los candidatos se insertan con el script `seedCandidatos.js`
- Las imágenes deben estar en la carpeta del frontend
- El sistema registra la IP y user-agent de cada voto para auditoría
