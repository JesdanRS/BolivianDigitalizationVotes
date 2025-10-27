# 🌐 Guía de Uso del API Gateway

## 📍 URL Base del API Gateway

**http://localhost:8080**

## 🏠 Página de Inicio

Cuando accedas a la raíz del API Gateway:

```
http://localhost:8080/
```

Verás un JSON con información útil del sistema:

```json
{
  "servicio": "API Gateway - Sistema de Votaciones Bolivianas",
  "version": "1.0.0",
  "estado": "Activo",
  "endpoints_disponibles": {
    "Usuarios API": "http://localhost:8080/api/usuarios",
    "Votaciones API": "http://localhost:8080/api/votaciones",
    "Swagger Votaciones": "http://localhost:8080/votaciones/swagger-ui/index.html",
    "Swagger Usuarios": "http://localhost:8080/usuarios/swagger-ui/index.html",
    "Eureka Dashboard": "http://localhost:8761",
    "Keycloak Admin": "http://localhost:8180"
  },
  "documentacion": {
    "Keycloak Setup": "Ver archivo KEYCLOAK_SETUP.md",
    "Quick Start": "Ver archivo KEYCLOAK_QUICK_START.md"
  }
}
```

---

## 🔌 Endpoints Disponibles

### 1. API de Votaciones

#### Base URL a través del Gateway:
```
http://localhost:8080/api/votaciones
```

#### Endpoints:

| Método | Endpoint | Descripción | Requiere Token | Rol |
|--------|----------|-------------|----------------|-----|
| GET | `/api/votaciones` | Listar todas las votaciones | ✅ | USER, ADMIN |
| GET | `/api/votaciones/{id}` | Obtener votación por ID | ✅ | USER, ADMIN |
| GET | `/api/votaciones/localidad/{localidad}` | Buscar por localidad | ✅ | USER, ADMIN |
| POST | `/api/votaciones` | Crear nueva votación | ✅ | ADMIN |

**Ejemplo de uso:**
```bash
# Obtener token primero
curl -X POST http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=admin-cli" \
  -d "username=admin-votaciones" \
  -d "password=admin123" \
  -d "grant_type=password"

# Listar votaciones (reemplaza {TOKEN} con tu access_token)
curl -X GET http://localhost:8080/api/votaciones \
  -H "Authorization: Bearer {TOKEN}"

# Crear votación (requiere rol ADMIN)
curl -X POST http://localhost:8080/api/votaciones \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 1,
    "candidatoId": 101,
    "localidad": "La Paz",
    "fechaVotacion": "2025-10-27T14:30:00"
  }'
```

---

### 2. API de Usuarios

#### Base URL a través del Gateway:
```
http://localhost:8080/api/usuarios
```

#### Endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/{id}` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear nuevo usuario |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario |

---

### 3. Documentación Swagger

#### Swagger UI de Votaciones:
```
http://localhost:8080/votaciones/swagger-ui/index.html
```

#### Swagger UI de Usuarios:
```
http://localhost:8080/usuarios/swagger-ui/index.html
```

#### OpenAPI Docs de Votaciones:
```
http://localhost:8080/votaciones/v3/api-docs
```

#### OpenAPI Docs de Usuarios:
```
http://localhost:8080/usuarios/v3/api-docs
```

---

### 4. Endpoints de Monitoreo (Actuator)

#### Health Check de Votaciones:
```
http://localhost:8080/votaciones/actuator/health
```

#### Health Check de Usuarios:
```
http://localhost:8080/usuarios/actuator/health
```

#### Info de Votaciones:
```
http://localhost:8080/votaciones/actuator/info
```

---

## 🔐 Autenticación con Keycloak

### Obtener Token JWT

**Endpoint de Keycloak:**
```
POST http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token
```

**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

**Body (para ADMIN):**
```
client_id=admin-cli
username=admin-votaciones
password=admin123
grant_type=password
```

**Body (para USER):**
```
client_id=admin-cli
username=usuario-votaciones
password=user123
grant_type=password
```

### Usar el Token en Peticiones

Una vez obtenido el token, inclúyelo en el header `Authorization`:

```
Authorization: Bearer {tu_access_token_aqui}
```

---

## 🧪 Pruebas con Postman

### Importar Colección

1. Abre Postman
2. File → Import
3. Selecciona: `Keycloak_Votaciones.postman_collection.json`

### Orden de Ejecución Recomendado:

1. **"Obtener Token ADMIN"** → Guarda el token automáticamente
2. **"[ADMIN] Listar Todas las Votaciones"** → Verifica acceso
3. **"[ADMIN] Crear Votación"** → Debe retornar 201
4. **"Obtener Token USER"** → Token de usuario regular
5. **"[USER] Listar Todas las Votaciones"** → Debe funcionar (200)
6. **"[USER] Intentar Crear Votación"** → Debe fallar (403)
7. **"Sin Token - Crear Votación"** → Debe fallar (401)

---

## 🚦 Códigos de Respuesta HTTP

| Código | Significado | Cuándo Ocurre |
|--------|-------------|---------------|
| **200 OK** | Éxito | GET exitoso, recurso encontrado |
| **201 Created** | Creado | POST exitoso, recurso creado |
| **401 Unauthorized** | No autorizado | Token no proporcionado o inválido |
| **403 Forbidden** | Prohibido | Token válido pero sin permisos |
| **404 Not Found** | No encontrado | Recurso no existe |
| **500 Internal Server Error** | Error del servidor | Error en el microservicio |

---

## 🔄 Flujo de una Petición

```
┌─────────────┐
│   Cliente   │
│  (Browser/  │
│  Postman)   │
└──────┬──────┘
       │ 1. GET http://localhost:8080/api/votaciones
       │    Authorization: Bearer {token}
       ▼
┌─────────────────┐
│  API Gateway    │ ← Punto de entrada único
│  (Puerto 8080)  │   - Valida ruta
└─────────┬───────┘   - Aplica filtros
          │
          │ 2. Eureka Service Discovery
          │    ¿Dónde está VOTACIONES-SERVICE?
          ▼
┌─────────────────┐
│ Eureka Server   │ ← Registro de servicios
│  (Puerto 8761)  │   Responde: "ms-votaciones:8082"
└─────────────────┘
          │
          │ 3. Forward a http://ms-votaciones:8082/api/votaciones
          ▼
┌───────────────────────┐
│ Votaciones Service    │
│   (Puerto 8082)       │
│                       │
│ ┌─────────────────┐   │
│ │ SecurityConfig  │   │ ← Valida JWT con Keycloak
│ └─────────────────┘   │
│          │            │
│          ▼            │
│ ┌─────────────────┐   │
│ │  Controller     │   │ ← Verifica @PreAuthorize
│ │  @PreAuthorize  │   │
│ └─────────────────┘   │
│          │            │
│          ▼            │
│     Respuesta         │
└───────────────────────┘
          │
          │ 4. Retorna respuesta
          ▼
┌─────────────────┐
│  API Gateway    │ ← Retorna al cliente
└─────────┬───────┘
          │
          │ 5. Respuesta JSON
          ▼
┌─────────────┐
│   Cliente   │
└─────────────┘
```

---

## 🛠️ Solución de Problemas

### Error 404 en la raíz del Gateway

**Problema:** Al acceder a `http://localhost:8080/` ves error 404.

**Solución:** 
- Verifica que el API Gateway esté corriendo
- Asegúrate de que el controlador `GatewayInfoController` esté compilado
- Reinicia el servicio:
  ```bash
  docker-compose restart api-gateway
  ```

### Error 503 Service Unavailable

**Problema:** El Gateway no puede comunicarse con el microservicio.

**Causas:**
- El microservicio no está registrado en Eureka
- El microservicio está caído

**Solución:**
1. Verifica Eureka Dashboard: http://localhost:8761
2. Verifica que el servicio esté corriendo:
   ```bash
   docker ps
   ```
3. Revisa los logs:
   ```bash
   docker logs ms-votaciones
   docker logs api-gateway
   ```

### Error 401 al hacer peticiones

**Problema:** Todas las peticiones devuelven 401.

**Solución:**
- Obtén un token válido de Keycloak
- Verifica que el token esté en el header `Authorization`
- Los tokens expiran en 5 minutos, obtén uno nuevo

### CORS Errors en el Frontend

**Problema:** El navegador bloquea las peticiones por CORS.

**Solución:**
- El API Gateway ya tiene CORS configurado
- Si persiste, verifica que estés usando el Gateway (puerto 8080)
- No hagas peticiones directas a los microservicios

---

## 📊 Monitoreo del Sistema

### Ver todos los servicios registrados:
```
http://localhost:8761
```

### Verificar salud del API Gateway:
```
http://localhost:8080/health
```

### Ver métricas de Votaciones Service:
```
http://localhost:8080/votaciones/actuator/metrics
```

---

## 🔗 Enlaces Rápidos

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **API Gateway** | http://localhost:8080 | Punto de entrada único |
| **Eureka Dashboard** | http://localhost:8761 | Registro de servicios |
| **Keycloak Admin** | http://localhost:8180 | Gestión de usuarios y roles |
| **Swagger Votaciones** | http://localhost:8080/votaciones/swagger-ui/index.html | Documentación API |
| **Swagger Usuarios** | http://localhost:8080/usuarios/swagger-ui/index.html | Documentación API |

---

## 📝 Notas Importantes

1. **Siempre usa el API Gateway** (puerto 8080) en lugar de acceder directamente a los microservicios
2. **Los tokens JWT expiran en 5 minutos** - obtén uno nuevo si recibes 401
3. **Eureka tarda ~30 segundos** en registrar nuevos servicios
4. **Keycloak tarda ~60 segundos** en iniciar completamente

---

## 🎯 Recomendaciones

### Para Desarrollo:
- Usa el Swagger UI a través del Gateway para probar endpoints
- Mantén el Eureka Dashboard abierto para monitorear servicios
- Guarda los tokens en variables de entorno de Postman

### Para Producción:
- Configura HTTPS en el Gateway
- Restringe CORS a dominios específicos
- Implementa rate limiting
- Usa secrets management para credenciales

---

**🚀 ¡El API Gateway está listo para usar!** Ahora tienes un punto de entrada centralizado para todos tus microservicios con enrutamiento, balanceo de carga y descubrimiento de servicios.
