# ❓ Preguntas Frecuentes - Keycloak

## 📚 Preguntas que te pueden hacer en la evaluación

---

### 1. ¿Qué es Keycloak y para qué sirve?

**Respuesta:**
Keycloak es un servidor de autenticación y autorización open-source. Sirve para:
- Gestionar usuarios y sus credenciales
- Generar tokens JWT para autenticar usuarios
- Controlar permisos mediante roles (ADMIN, USER)
- Centralizar la seguridad de múltiples microservicios

---

### 2. ¿Qué es un token JWT?

**Respuesta:**
JWT (JSON Web Token) es un estándar para transmitir información de forma segura. Tiene 3 partes:
1. **Header:** Tipo de token y algoritmo de firma
2. **Payload:** Datos del usuario (username, email, roles)
3. **Signature:** Firma digital que garantiza que no fue modificado

Ejemplo: `eyJhbGci.eyJzdWIi.SflKxwRJ` (cada parte separada por punto)

---

### 3. ¿Cómo funciona el flujo de autenticación?

**Respuesta:**
1. Usuario envía credenciales (username/password) a Keycloak
2. Keycloak valida y devuelve un token JWT
3. Usuario incluye el token en cada petición (header `Authorization: Bearer TOKEN`)
4. Microservicio valida el token con Keycloak
5. Si es válido y tiene el rol necesario, permite el acceso

---

### 4. ¿Dónde está configurado Keycloak en tu proyecto?

**Respuesta:**
- **Docker Compose:** `docker-compose.yml` líneas 115-133
- **Realm:** `keycloak/votaciones-realm.json` (usuarios y roles)
- **Seguridad:** `resultados_estadisticas/src/.../config/SecurityConfig.java`
- **Application Properties:** `spring.security.oauth2.resourceserver.jwt.jwk-set-uri`

---

### 5. ¿Qué usuarios tienes configurados?

**Respuesta:**
Tengo 2 usuarios en el realm `votaciones-realm`:
- **admin** / admin123 → Rol ADMIN (puede crear, modificar, eliminar)
- **user** / user123 → Rol USER (solo puede consultar)

---

### 6. ¿Cómo proteges los endpoints?

**Respuesta:**
Uso la anotación `@PreAuthorize` en los controllers:

```java
@PreAuthorize("hasRole('ADMIN')")  // Solo ADMIN
@PostMapping
public ResponseEntity<ResultadoMesa> crear(...) { ... }

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")  // USER o ADMIN
@GetMapping
public ResponseEntity<List<ResultadoMesa>> listar() { ... }
```

---

### 7. ¿Qué hace SecurityConfig.java?

**Respuesta:**
`SecurityConfig` configura 3 cosas principales:

1. **JwtDecoder:** Valida tokens JWT con las claves públicas de Keycloak
2. **SecurityFilterChain:** Define qué endpoints son públicos y cuáles requieren autenticación
3. **JwtAuthenticationConverter:** Extrae los roles del token y los convierte a authorities de Spring Security

---

### 8. ¿Qué pasa si envío una petición sin token?

**Respuesta:**
El microservicio devuelve **401 Unauthorized** porque Spring Security detecta que no hay token en el header `Authorization`.

---

### 9. ¿Qué pasa si un USER intenta crear un resultado?

**Respuesta:**
El endpoint `POST /api/resultados` tiene `@PreAuthorize("hasRole('ADMIN')")`, entonces:
- Spring Security valida el token ✅
- Extrae el rol: USER ✅
- Verifica si tiene rol ADMIN ❌
- Devuelve **403 Forbidden**

---

### 10. ¿Cuánto tiempo dura un token?

**Respuesta:**
Los tokens expiran en **3600 segundos (1 hora)**. Después de ese tiempo, hay que obtener un nuevo token.

---

### 11. ¿Cómo obtienes un token en Postman?

**Respuesta:**
Hago una petición POST a:
```
http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
```

Con body (x-www-form-urlencoded):
```
client_id: votaciones-client
username: admin
password: admin123
grant_type: password
```

Keycloak devuelve un JSON con el `access_token`.

---

### 12. ¿Cómo usas el token en las peticiones?

**Respuesta:**
Agrego un header en cada petición:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

El formato es: `Bearer` + espacio + token completo.

---

### 13. ¿Qué endpoints son públicos (sin token)?

**Respuesta:**
En `SecurityConfig` definí estos endpoints como públicos:
- `/swagger-ui/**` → Documentación Swagger
- `/v3/api-docs/**` → OpenAPI docs
- `/actuator/**` → Health checks

Todos los demás endpoints requieren autenticación.

---

### 14. ¿Cómo valida Spring Security el token?

**Respuesta:**
1. Descarga las claves públicas de Keycloak (JWK Set)
2. Verifica la firma digital del token
3. Verifica que no haya expirado
4. Extrae los roles del campo `realm_access.roles`
5. Convierte los roles a authorities (ADMIN → ROLE_ADMIN)
6. Verifica con `@PreAuthorize` si tiene permisos

---

### 15. ¿Qué es el JWK Set URI?

**Respuesta:**
Es la URL donde Keycloak publica sus claves públicas para validar tokens:
```
http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/certs
```

Spring Security usa estas claves para verificar que el token fue firmado por Keycloak.

---

### 16. ¿Por qué usas `host.docker.internal` en docker-compose?

**Respuesta:**
Porque el microservicio corre dentro de Docker y necesita acceder a Keycloak. 
- Desde fuera de Docker: `localhost:8180`
- Desde dentro de Docker: `host.docker.internal:8180`

Esto permite que el contenedor acceda a servicios en el host.

---

### 17. ¿Qué dependencias necesitas para Keycloak?

**Respuesta:**
En `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

---

### 18. ¿Cómo probaste que funciona?

**Respuesta:**
Hice 4 pruebas en Postman:

1. ✅ **Obtener token:** POST a Keycloak → Recibí access_token
2. ✅ **GET con token válido:** 200 OK con datos de PostgreSQL
3. ❌ **GET sin token:** 401 Unauthorized
4. ❌ **POST con USER:** 403 Forbidden (USER no puede crear)

---

### 19. ¿Qué es un Resource Server?

**Respuesta:**
Es un servidor que protege recursos (endpoints) y valida tokens JWT. En este caso, `ms-resultados` es un Resource Server porque:
- No genera tokens (eso lo hace Keycloak)
- Solo valida tokens que recibe
- Protege sus endpoints según roles

---

### 20. ¿Qué es el realm en Keycloak?

**Respuesta:**
Un realm es un espacio aislado que contiene:
- Usuarios
- Roles
- Clientes (aplicaciones)
- Configuración de seguridad

Mi realm se llama `votaciones-realm` y está definido en `keycloak/votaciones-realm.json`.

---

### 21. ¿Qué es el client_id?

**Respuesta:**
Es el identificador de la aplicación cliente que solicita tokens. En mi caso:
- `client_id: votaciones-client`
- Configurado como "public client" (no requiere secret)
- Permite "Direct Access Grants" (username/password flow)

---

### 22. ¿Por qué algunos endpoints requieren ADMIN y otros USER?

**Respuesta:**
Es una buena práctica de seguridad:
- **Operaciones de escritura** (POST, PUT, DELETE) → Solo ADMIN
- **Operaciones de lectura** (GET) → USER o ADMIN

Así evitamos que usuarios normales modifiquen datos críticos.

---

### 23. ¿Qué pasa si Keycloak está caído?

**Respuesta:**
- No se pueden obtener nuevos tokens
- Los tokens existentes siguen funcionando hasta que expiren
- El microservicio puede validar tokens usando las claves públicas cacheadas
- Pero después de 1 hora, nadie podrá autenticarse

---

### 24. ¿Cómo se comunican los microservicios con Keycloak?

**Respuesta:**
- **Para obtener token:** Cliente → Keycloak (HTTP POST)
- **Para validar token:** Microservicio descarga claves públicas de Keycloak
- **No hay comunicación en cada petición:** El microservicio valida localmente usando las claves públicas

---

### 25. ¿Qué ventajas tiene usar Keycloak?

**Respuesta:**
1. **Centralización:** Un solo lugar para gestionar usuarios
2. **Estándar:** Usa OAuth2/OpenID Connect
3. **Escalabilidad:** Múltiples microservicios usan el mismo Keycloak
4. **Seguridad:** Tokens firmados digitalmente
5. **Roles:** Control de acceso basado en roles (RBAC)

---

### 26. ¿Cómo agregarías un nuevo usuario?

**Respuesta:**
Hay 2 formas:

**Opción 1:** Editar `keycloak/votaciones-realm.json` y agregar:
```json
{
  "username": "nuevo",
  "password": "pass123",
  "realmRoles": ["USER"]
}
```

**Opción 2:** Entrar al panel de administración de Keycloak:
- http://localhost:8180/auth
- Login: admin / admin
- Ir a Users → Add User

---

### 27. ¿Qué es @EnableMethodSecurity?

**Respuesta:**
Es una anotación en `SecurityConfig` que habilita el uso de `@PreAuthorize` en los controllers. Sin esta anotación, `@PreAuthorize` no funcionaría.

---

### 28. ¿Por qué deshabilitaste CSRF?

**Respuesta:**
```java
.csrf(csrf -> csrf.disable())
```

Porque es una API REST stateless (sin sesiones). CSRF solo es necesario en aplicaciones con sesiones del lado del servidor. Como usamos tokens JWT, no necesitamos protección CSRF.

---

### 29. ¿Qué es SessionCreationPolicy.STATELESS?

**Respuesta:**
```java
.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
)
```

Significa que el servidor no guarda sesiones. Cada petición es independiente y debe incluir su token. Esto es típico de APIs REST con JWT.

---

### 30. ¿Cómo demuestras que cumples con los criterios?

**Respuesta:**
Muestro:

1. **Configuración de realm y roles:** Archivo `votaciones-realm.json`
2. **Integración con microservicios:** `SecurityConfig.java` y `application.properties`
3. **Protección de endpoints:** `ResultadosController.java` con `@PreAuthorize`
4. **Peticiones funcionando:** Screenshots de Postman
   - ✅ Token obtenido
   - ✅ GET con token → 200 OK
   - ❌ GET sin token → 401
   - ❌ POST con USER → 403

---

## 🎯 Tips para la Evaluación

1. **Practica explicar el flujo** sin mirar apuntes
2. **Ten Postman abierto** con las peticiones listas
3. **Conoce dónde está cada archivo** de configuración
4. **Entiende qué hace cada anotación** (@PreAuthorize, @EnableMethodSecurity)
5. **Sé capaz de mostrar el token** en jwt.io y explicar su contenido

---

¡Con estas respuestas estás listo para cualquier pregunta! 💪
