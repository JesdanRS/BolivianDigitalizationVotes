# 🎨 FLUJO VISUAL DE KEYCLOAK

## 📊 Diagrama del Flujo Completo

```
┌─────────────┐
│   POSTMAN   │
│  (Cliente)  │
└──────┬──────┘
       │
       │ 1. POST /token
       │    username: admin
       │    password: admin123
       ▼
┌─────────────────────────────────┐
│        KEYCLOAK                 │
│     (Puerto 8180)               │
│                                 │
│  ✓ Valida credenciales          │
│  ✓ Verifica rol: ADMIN          │
│  ✓ Genera token JWT             │
└──────────────┬──────────────────┘
               │
               │ 2. Devuelve token JWT
               │    eyJhbGciOiJSUzI1NiIs...
               ▼
┌─────────────────────────────────┐
│          POSTMAN                │
│  Guarda token para usar         │
└──────────────┬──────────────────┘
               │
               │ 3. GET /ms-resultados/api/resultados
               │    Authorization: Bearer TOKEN
               ▼
┌─────────────────────────────────┐
│       API GATEWAY               │
│      (Puerto 8080)              │
│                                 │
│  ✓ Recibe petición              │
│  ✓ Redirige a ms-resultados     │
└──────────────┬──────────────────┘
               │
               │ 4. Reenvía petición con token
               ▼
┌─────────────────────────────────┐
│   MS-RESULTADOS                 │
│   (Puerto 8083)                 │
│                                 │
│   SecurityConfig:               │
│   ✓ Valida token con Keycloak   │
│   ✓ Extrae roles del token      │
│   ✓ Verifica @PreAuthorize      │
└──────────────┬──────────────────┘
               │
               │ 5. Si token válido y rol correcto
               ▼
┌─────────────────────────────────┐
│   ResultadosController          │
│                                 │
│   @PreAuthorize("hasRole...")   │
│   ✓ Ejecuta método              │
└──────────────┬──────────────────┘
               │
               │ 6. Consulta BD
               ▼
┌─────────────────────────────────┐
│   POSTGRESQL                    │
│   (Puerto 5434)                 │
│                                 │
│   ✓ Ejecuta query               │
│   ✓ Devuelve datos              │
└──────────────┬──────────────────┘
               │
               │ 7. Datos
               ▼
┌─────────────────────────────────┐
│   MS-RESULTADOS                 │
│   ✓ Procesa respuesta           │
└──────────────┬──────────────────┘
               │
               │ 8. JSON Response
               ▼
┌─────────────────────────────────┐
│   API GATEWAY                   │
│   ✓ Reenvía respuesta           │
└──────────────┬──────────────────┘
               │
               │ 9. 200 OK + Datos
               ▼
┌─────────────────────────────────┐
│          POSTMAN                │
│   Muestra respuesta             │
└─────────────────────────────────┘
```

---

## 🔐 Contenido del Token JWT

Cuando Keycloak genera un token, incluye esta información:

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "..."
  },
  "payload": {
    "exp": 1730073660,           // ⏰ Cuándo expira (1 hora)
    "iat": 1730070060,           // 🕐 Cuándo se creó
    "jti": "...",                // 🆔 ID único del token
    "iss": "http://localhost:8180/auth/realms/votaciones-realm",
    "sub": "...",                // 👤 ID del usuario
    "typ": "Bearer",
    "azp": "votaciones-client",
    "session_state": "...",
    "realm_access": {
      "roles": [
        "ADMIN"                  // 🎭 ROL DEL USUARIO
      ]
    },
    "scope": "profile email",
    "email_verified": true,
    "name": "Admin System",
    "preferred_username": "admin",
    "given_name": "Admin",
    "family_name": "System",
    "email": "admin@votaciones.bo"
  },
  "signature": "..."             // 🔏 Firma digital
}
```

**Lo más importante:** `realm_access.roles` → Spring Security usa esto para `@PreAuthorize`

---

## 🛡️ Cómo Spring Security Valida el Token

```
┌─────────────────────────────────────────────────────┐
│  1. LLEGA PETICIÓN                                  │
│     GET /api/resultados                             │
│     Authorization: Bearer TOKEN                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  2. SecurityFilterChain                             │
│     ¿Es endpoint público?                           │
│     - /swagger-ui/** → SÍ → Permitir               │
│     - /actuator/** → SÍ → Permitir                 │
│     - /api/** → NO → Requiere autenticación        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  3. JwtDecoder                                      │
│     ✓ Descarga claves públicas de Keycloak         │
│     ✓ Verifica firma del token                     │
│     ✓ Verifica que no haya expirado                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  4. JwtAuthenticationConverter                      │
│     ✓ Extrae realm_access.roles del token          │
│     ✓ Convierte a GrantedAuthority                 │
│       ["ADMIN"] → [ROLE_ADMIN]                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  5. @PreAuthorize en Controller                     │
│     @PreAuthorize("hasRole('ADMIN')")              │
│     ¿Usuario tiene ROLE_ADMIN?                     │
│     - SÍ → Ejecutar método                         │
│     - NO → 403 Forbidden                           │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Caso Exitoso: ADMIN Lista Resultados

```
POSTMAN
  │
  │ GET /ms-resultados/api/resultados
  │ Authorization: Bearer TOKEN_ADMIN
  │
  ▼
API GATEWAY (8080)
  │
  │ Redirige a ms-resultados
  │
  ▼
MS-RESULTADOS (8083)
  │
  ├─ SecurityConfig valida token ✅
  ├─ Extrae rol: ADMIN ✅
  │
  ▼
ResultadosController
  │
  │ @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  │ ✅ ADMIN tiene permiso
  │
  ▼
ResultadosService
  │
  │ resultadosRepository.findAll()
  │
  ▼
POSTGRESQL
  │
  │ SELECT * FROM resultado_mesa
  │
  ▼
RESPUESTA
  │
  │ 200 OK
  │ [
  │   { "id": 1, "numeroMesa": 1001, ... },
  │   { "id": 2, "numeroMesa": 1002, ... }
  │ ]
  │
  ▼
POSTMAN muestra datos ✅
```

---

## ❌ Caso Error: Sin Token

```
POSTMAN
  │
  │ GET /ms-resultados/api/resultados
  │ (Sin header Authorization)
  │
  ▼
API GATEWAY (8080)
  │
  ▼
MS-RESULTADOS (8083)
  │
  ├─ SecurityConfig busca token
  ├─ ❌ No encuentra token
  │
  ▼
RESPUESTA
  │
  │ 401 Unauthorized
  │ {
  │   "status": 401,
  │   "error": "Unauthorized",
  │   "message": "Unauthorized"
  │ }
  │
  ▼
POSTMAN muestra error ❌
```

---

## ❌ Caso Error: USER Intenta Crear

```
POSTMAN
  │
  │ POST /ms-resultados/api/resultados
  │ Authorization: Bearer TOKEN_USER
  │ Body: { ... datos ... }
  │
  ▼
API GATEWAY (8080)
  │
  ▼
MS-RESULTADOS (8083)
  │
  ├─ SecurityConfig valida token ✅
  ├─ Extrae rol: USER ✅
  │
  ▼
ResultadosController
  │
  │ @PreAuthorize("hasRole('ADMIN')")
  │ ❌ USER no tiene rol ADMIN
  │
  ▼
RESPUESTA
  │
  │ 403 Forbidden
  │ {
  │   "status": 403,
  │   "error": "Forbidden",
  │   "message": "Forbidden"
  │ }
  │
  ▼
POSTMAN muestra error ❌
```

---

## 🔄 Ciclo de Vida del Token

```
┌─────────────────────────────────────────────────────┐
│  CREACIÓN                                           │
│  - Usuario envía credenciales a Keycloak           │
│  - Keycloak valida y genera token                  │
│  - Token válido por 3600 segundos (1 hora)         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  USO                                                │
│  - Usuario incluye token en cada petición          │
│  - Microservicio valida token con Keycloak         │
│  - Si válido → permite acceso                      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  EXPIRACIÓN (después de 1 hora)                    │
│  - Token ya no es válido                           │
│  - Peticiones devuelven 401                        │
│  - Usuario debe obtener nuevo token                │
└─────────────────────────────────────────────────────┘
```

---

## 🎭 Roles y Permisos

```
┌─────────────────────────────────────────────────────┐
│  ROL: ADMIN                                         │
│  ✅ Puede hacer TODO                                │
│                                                     │
│  Endpoints permitidos:                              │
│  ✅ GET /api/resultados                             │
│  ✅ GET /api/resultados/{id}                        │
│  ✅ POST /api/resultados                            │
│  ✅ PUT /api/resultados/{id}                        │
│  ✅ DELETE /api/resultados/{id}                     │
│  ✅ GET /api/resultados/departamento/{dept}         │
│  ✅ GET /api/resultados/estadisticas                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ROL: USER                                          │
│  ✅ Solo puede CONSULTAR                            │
│                                                     │
│  Endpoints permitidos:                              │
│  ✅ GET /api/resultados                             │
│  ✅ GET /api/resultados/{id}                        │
│  ❌ POST /api/resultados                            │
│  ❌ PUT /api/resultados/{id}                        │
│  ❌ DELETE /api/resultados/{id}                     │
│  ✅ GET /api/resultados/departamento/{dept}         │
│  ✅ GET /api/resultados/estadisticas                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  SIN TOKEN                                          │
│  ✅ Solo endpoints públicos                         │
│                                                     │
│  Endpoints permitidos:                              │
│  ❌ GET /api/resultados                             │
│  ❌ GET /api/resultados/{id}                        │
│  ❌ POST /api/resultados                            │
│  ❌ PUT /api/resultados/{id}                        │
│  ❌ DELETE /api/resultados/{id}                     │
│  ✅ GET /swagger-ui.html                            │
│  ✅ GET /actuator/health                            │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 Verificación del Token

Puedes ver el contenido de tu token en: **https://jwt.io/**

1. Copia tu `access_token`
2. Pégalo en jwt.io
3. Verás 3 secciones:
   - **Header:** Algoritmo de firma
   - **Payload:** Datos del usuario y roles
   - **Signature:** Firma digital (verifica autenticidad)

---

## 📊 Resumen de Códigos HTTP

```
┌─────────┬──────────────────┬─────────────────────────────┐
│ Código  │ Significado      │ Cuándo Ocurre               │
├─────────┼──────────────────┼─────────────────────────────┤
│ 200 OK  │ Éxito            │ GET, PUT exitosos           │
├─────────┼──────────────────┼─────────────────────────────┤
│ 201     │ Creado           │ POST exitoso                │
├─────────┼──────────────────┼─────────────────────────────┤
│ 204     │ Sin contenido    │ DELETE exitoso              │
├─────────┼──────────────────┼─────────────────────────────┤
│ 401     │ No autenticado   │ Sin token o token inválido  │
├─────────┼──────────────────┼─────────────────────────────┤
│ 403     │ Sin permisos     │ Token válido pero sin rol   │
├─────────┼──────────────────┼─────────────────────────────┤
│ 404     │ No encontrado    │ ID no existe en BD          │
└─────────┴──────────────────┴─────────────────────────────┘
```

---

## 🎯 Puntos Clave para la Evaluación

1. **Keycloak genera tokens JWT** con información del usuario y roles
2. **Spring Security valida** cada token automáticamente
3. **@PreAuthorize** controla qué roles pueden acceder a cada endpoint
4. **Sin token → 401**, con token pero sin rol → **403**
5. **Tokens expiran en 1 hora**, después hay que obtener uno nuevo

---

¡Con este diagrama visual entiendes todo el flujo! 🎨
