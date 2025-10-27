# ✅ CRITERIO 5: KEYCLOAK (SEGURIDAD)

## 📋 Checklist de Verificación

### ✅ Configuración de realm y roles
- [x] Realm `votaciones-realm` creado
- [x] Roles definidos: ADMIN, USER
- [x] Usuarios creados:
  - admin/admin123 (rol ADMIN)
  - user/user123 (rol USER)
- [x] Cliente `votaciones-client` configurado

### ✅ Integración con microservicios
- [x] Dependencia `spring-boot-starter-oauth2-resource-server`
- [x] JWT Decoder configurado
- [x] Endpoints requieren token JWT
- [x] Postman puede obtener token y acceder

### ✅ Protección de endpoints
- [x] Endpoints protegidos con `@PreAuthorize`
- [x] Peticiones sin token devuelven 401 Unauthorized
- [x] Peticiones con token incorrecto devuelven 403 Forbidden
- [x] ADMIN puede: POST, PUT, DELETE
- [x] USER y ADMIN pueden: GET

---

## 🗂️ PARTE 1: CONFIGURACIÓN DE REALM Y ROLES

### 📁 Archivo: `keycloak/votaciones-realm.json`

Este archivo define toda la configuración de Keycloak:

```json
{
  "realm": "votaciones-realm",
  "enabled": true,
  "roles": {
    "realm": [
      {
        "name": "ADMIN",
        "description": "Administrador con acceso completo"
      },
      {
        "name": "USER",
        "description": "Usuario con acceso de lectura"
      }
    ]
  },
  "users": [
    {
      "username": "admin",
      "enabled": true,
      "email": "admin@votaciones.bo",
      "credentials": [
        {
          "type": "password",
          "value": "admin123",
          "temporary": false
        }
      ],
      "realmRoles": ["ADMIN"]
    },
    {
      "username": "user",
      "enabled": true,
      "email": "user@votaciones.bo",
      "credentials": [
        {
          "type": "password",
          "value": "user123",
          "temporary": false
        }
      ],
      "realmRoles": ["USER"]
    }
  ]
}
```

### 🔍 Explicación de la configuración

#### Realm
- **Nombre:** `votaciones-realm`
- **Función:** Contenedor lógico que agrupa usuarios, roles, clientes, etc.

#### Roles
1. **ADMIN**
   - Puede crear, actualizar y eliminar resultados (POST, PUT, DELETE)
   - Puede consultar todos los datos (GET)

2. **USER**
   - Solo puede consultar datos (GET)
   - NO puede crear, actualizar ni eliminar

#### Usuarios predefinidos

| Usuario | Password | Rol | Email |
|---------|----------|-----|-------|
| admin | admin123 | ADMIN | admin@votaciones.bo |
| user | user123 | USER | user@votaciones.bo |

#### Cliente
- **clientId:** `votaciones-client`
- **Tipo:** Public client
- **Direct Access Grants:** Habilitado (permite login directo username/password)

### 🚀 Acceso al Panel de Administración

1. **Levantar Keycloak:**
```bash
docker compose up -d keycloak
```

2. **Acceder al panel:**
```
URL: http://localhost:8180/auth
```

3. **Login como administrador:**
```
Usuario: admin
Password: admin
```

4. **Seleccionar realm:**
- En la esquina superior izquierda, cambiar de "master" a "votaciones-realm"

5. **Verificar configuración:**
- **Roles:** Click en "Realm roles" → Ver "ADMIN" y "USER"
- **Usuarios:** Click en "Users" → Ver "admin" y "user"
- **Cliente:** Click en "Clients" → Ver "votaciones-client"

---

## 🗂️ PARTE 2: INTEGRACIÓN CON MICROSERVICIOS

### 📁 Archivo: `pom.xml`

Dependencias necesarias:

```xml
<!-- Security con OAuth2 Resource Server (Keycloak) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

**¿Qué hacen?**
- `spring-boot-starter-security`: Framework de seguridad de Spring
- `spring-boot-starter-oauth2-resource-server`: Permite validar tokens JWT de Keycloak

### 📁 Archivo: `application.properties`

Configuración del JWK Set URI:

```properties
# JWK Set URI para validar tokens JWT de Keycloak
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/certs

# Logging para debug de seguridad (opcional)
logging.level.org.springframework.security=DEBUG
```

**¿Qué es JWK Set URI?**
- Es la URL donde Keycloak publica sus claves públicas
- Spring Boot usa estas claves para verificar que los tokens JWT son legítimos
- Si el token no está firmado correctamente, se rechaza

### 📁 Archivo: `SecurityConfig.java`

Configuración completa de seguridad:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
        
        // Solo validar timestamps, NO validar issuer
        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(
            new JwtTimestampValidator()
        );
        
        jwtDecoder.setJwtValidator(validator);
        return jwtDecoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Permitir acceso público a Swagger y Actuator
                .requestMatchers(
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/swagger-ui.html",
                    "/actuator/**"
                ).permitAll()
                // Todos los demás endpoints requieren autenticación
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            // Extraer roles del realm
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            Collection<GrantedAuthority> authorities;

            if (realmAccess != null && realmAccess.containsKey("roles")) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) realmAccess.get("roles");
                authorities = roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
            } else {
                authorities = List.of();
            }

            return authorities;
        });

        return converter;
    }
}
```

**Explicación:**

1. **JwtDecoder:** Valida la firma del token usando las claves públicas de Keycloak

2. **SecurityFilterChain:** Define qué rutas requieren autenticación:
   - `/swagger-ui/**`, `/actuator/**`: Público
   - Todos los demás: Requieren autenticación

3. **JwtAuthenticationConverter:** Extrae los roles del token:
   - Lee `realm_access.roles` del JWT
   - Convierte "ADMIN" → "ROLE_ADMIN"
   - Convierte "USER" → "ROLE_USER"

### 🔄 Flujo de Autenticación

```
1. Cliente obtiene token de Keycloak
   POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
   
2. Cliente envía petición con token
   GET http://localhost:8083/api/resultados
   Header: Authorization: Bearer <token>
   
3. Spring Boot valida el token
   - Descarga claves públicas de Keycloak (JWK Set)
   - Verifica firma del token
   - Extrae roles del token
   
4. Spring Boot autoriza la petición
   - Verifica @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
   - Si el token tiene rol USER o ADMIN → OK
   - Si no → 403 Forbidden
```

---

## 🗂️ PARTE 3: PROTECCIÓN DE ENDPOINTS

### 📁 Archivo: `ResultadosController.java`

Endpoints protegidos con `@PreAuthorize`:

```java
@RestController
@RequestMapping("/api/resultados")
public class ResultadosController {

    // Solo ADMIN puede crear
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResultadoMesa> crear(...) { }

    // USER y ADMIN pueden listar
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<ResultadoMesa>> listar() { }

    // USER y ADMIN pueden obtener por ID
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ResultadoMesa> obtenerPorId(...) { }

    // Solo ADMIN puede actualizar
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResultadoMesa> actualizar(...) { }

    // Solo ADMIN puede eliminar
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(...) { }
}
```

### 📊 Tabla de Permisos

| Endpoint | Método | Rol Requerido | ADMIN | USER |
|----------|--------|---------------|-------|------|
| `/api/resultados` | POST | ADMIN | ✅ | ❌ |
| `/api/resultados` | GET | USER, ADMIN | ✅ | ✅ |
| `/api/resultados/{id}` | GET | USER, ADMIN | ✅ | ✅ |
| `/api/resultados/{id}` | PUT | ADMIN | ✅ | ❌ |
| `/api/resultados/{id}` | DELETE | ADMIN | ✅ | ❌ |
| `/api/resultados/departamento/{dep}` | GET | USER, ADMIN | ✅ | ✅ |
| `/api/resultados/inscritos-minimo/{min}` | GET | USER, ADMIN | ✅ | ✅ |
| `/api/resultados/estadisticas` | GET | USER, ADMIN | ✅ | ✅ |

---

## 🧪 PRUEBAS CON POSTMAN

### 1. Obtener Token (ADMIN)

**Request:**
```
POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

Body (x-www-form-urlencoded):
client_id: votaciones-client
username: admin
password: admin123
grant_type: password
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI...",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "token_type": "Bearer"
}
```

**Copiar el `access_token`** para usarlo en las siguientes peticiones.

---

### 2. Obtener Token (USER)

**Request:**
```
POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

Body (x-www-form-urlencoded):
client_id: votaciones-client
username: user
password: user123
grant_type: password
```

---

### 3. Petición SIN Token (401 Unauthorized)

**Request:**
```
GET http://localhost:8083/api/resultados
```

**Response:**
```
401 Unauthorized
```

**Explicación:** No hay token, Spring Security rechaza la petición.

---

### 4. Petición CON Token (USER) - GET OK

**Request:**
```
GET http://localhost:8083/api/resultados
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI... (token de USER)
```

**Response:**
```json
[
  {
    "id": 1,
    "departamento": "La Paz",
    ...
  }
]
```

**Explicación:** USER tiene permiso para GET.

---

### 5. Petición CON Token (USER) - POST 403 Forbidden

**Request:**
```
POST http://localhost:8083/api/resultados
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI... (token de USER)
Content-Type: application/json

{
  "departamento": "Oruro",
  "municipio": "Oruro",
  ...
}
```

**Response:**
```
403 Forbidden
```

**Explicación:** USER NO tiene permiso para POST (solo ADMIN).

---

### 6. Petición CON Token (ADMIN) - POST OK

**Request:**
```
POST http://localhost:8083/api/resultados
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI... (token de ADMIN)
Content-Type: application/json

{
  "departamento": "Oruro",
  "municipio": "Oruro",
  "recinto": "Colegio Nacional",
  "mesa": "Mesa 10",
  "inscritos": 200,
  "votosValidosPresencial": 120,
  "votosNulosPresencial": 8,
  "votosBlancosPresencial": 3,
  "votosValidosWeb": 50,
  "votosNulosWeb": 4,
  "votosBlancosWeb": 2
}
```

**Response:**
```json
{
  "id": 4,
  "departamento": "Oruro",
  ...
}
```

**Explicación:** ADMIN tiene permiso para POST.

---

## 🎯 DEMOSTRACIÓN DEL CRITERIO 5

### Secuencia Recomendada (10 minutos)

#### 1. Mostrar Panel de Keycloak (2 min)

**URL:** `http://localhost:8180/auth`

**Mostrar:**
1. Login como admin/admin
2. Cambiar a realm "votaciones-realm"
3. **Realm roles:** Mostrar ADMIN y USER
4. **Users:** Mostrar usuarios admin y user
5. **Clients:** Mostrar votaciones-client

**Explicación:**
> "Keycloak es el servidor de autenticación. Define un realm con dos roles: ADMIN (acceso completo) y USER (solo lectura). Tenemos dos usuarios de ejemplo: admin con rol ADMIN, y user con rol USER."

---

#### 2. Mostrar Código de Seguridad (2 min)

**Archivo:** `SecurityConfig.java`

**Mostrar:**
1. `JwtDecoder` - Valida tokens
2. `SecurityFilterChain` - Swagger público, demás requieren autenticación
3. `JwtAuthenticationConverter` - Extrae roles del token

**Explicación:**
> "Spring Security valida automáticamente los tokens JWT. El JwtDecoder verifica la firma usando las claves públicas de Keycloak. Si el token es inválido, se rechaza. Si es válido, extraemos los roles para usar con @PreAuthorize."

---

**Archivo:** `ResultadosController.java`

**Mostrar:**
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<ResultadoMesa> crear(...) { }

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
@GetMapping
public ResponseEntity<List<ResultadoMesa>> listar() { }
```

**Explicación:**
> "Los endpoints están protegidos con @PreAuthorize. POST, PUT, DELETE requieren rol ADMIN. GET permite USER o ADMIN. Sin token, se devuelve 401. Con token incorrecto, 403."

---

#### 3. Obtener Token en Postman (2 min)

**Request:**
```
POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
```

**Body (x-www-form-urlencoded):**
```
client_id: votaciones-client
username: admin
password: admin123
grant_type: password
```

**Mostrar:** Copiar el `access_token` de la respuesta.

---

#### 4. Probar sin Token (1 min)

**Request:**
```
GET http://localhost:8083/api/resultados
```

**Resultado:** `401 Unauthorized`

**Explicación:**
> "Sin token, Spring Security rechaza la petición con 401 Unauthorized."

---

#### 5. Probar con Token USER (2 min)

**Obtener token de USER:**
```
POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token

Body:
username: user
password: user123
```

**Probar GET (OK):**
```
GET http://localhost:8083/api/resultados
Authorization: Bearer <token-user>
```

**Resultado:** 200 OK con datos

**Probar POST (Forbidden):**
```
POST http://localhost:8083/api/resultados
Authorization: Bearer <token-user>
Content-Type: application/json

{...datos...}
```

**Resultado:** `403 Forbidden`

**Explicación:**
> "Con token de USER, GET funciona porque USER tiene permiso. Pero POST devuelve 403 porque solo ADMIN puede crear."

---

#### 6. Probar con Token ADMIN (1 min)

**Probar POST (OK):**
```
POST http://localhost:8083/api/resultados
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "departamento": "Tarija",
  "municipio": "Tarija",
  "recinto": "Colegio Central",
  "mesa": "Mesa 20",
  "inscritos": 180,
  "votosValidosPresencial": 110,
  "votosNulosPresencial": 8,
  "votosBlancosPresencial": 3,
  "votosValidosWeb": 45,
  "votosNulosWeb": 4,
  "votosBlancosWeb": 2
}
```

**Resultado:** 201 Created

**Explicación:**
> "Con token de ADMIN, POST funciona correctamente. ADMIN tiene todos los permisos."

---

## 📋 CHECKLIST FINAL

### Configuración de realm y roles
- [x] Keycloak corriendo en puerto 8180
- [x] Realm `votaciones-realm` creado
- [x] Roles ADMIN y USER definidos
- [x] Usuario admin creado (rol ADMIN)
- [x] Usuario user creado (rol USER)
- [x] Cliente `votaciones-client` configurado
- [x] Panel de administración accesible

### Integración con microservicios
- [x] Dependencia OAuth2 Resource Server agregada
- [x] JWK Set URI configurado
- [x] JwtDecoder configurado
- [x] SecurityFilterChain configurado
- [x] JwtAuthenticationConverter extrae roles
- [x] Postman puede obtener token
- [x] Postman puede acceder con token

### Protección de endpoints
- [x] `@PreAuthorize` en endpoints POST, PUT, DELETE (ADMIN)
- [x] `@PreAuthorize` en endpoints GET (USER, ADMIN)
- [x] Sin token devuelve 401 Unauthorized
- [x] Token USER en POST devuelve 403 Forbidden
- [x] Token ADMIN en POST funciona correctamente
- [x] Token USER en GET funciona correctamente

---

## 📸 CAPTURAS RECOMENDADAS

1. **Keycloak Dashboard** - Realm roles mostrando ADMIN y USER
2. **Keycloak Dashboard** - Users mostrando admin y user
3. **SecurityConfig.java** - Código con @EnableMethodSecurity
4. **ResultadosController.java** - Endpoints con @PreAuthorize
5. **Postman** - Obtener token (request y response)
6. **Postman** - GET sin token (401)
7. **Postman** - GET con token USER (200 OK)
8. **Postman** - POST con token USER (403 Forbidden)
9. **Postman** - POST con token ADMIN (201 Created)

---

## 💡 EXPLICACIONES CLAVE

**¿Qué es Keycloak?**
> "Keycloak es un servidor de autenticación y autorización. Gestiona usuarios, roles, y genera tokens JWT que los microservicios validan."

**¿Qué es un token JWT?**
> "JSON Web Token. Es como un carnet de identidad digital que contiene información del usuario (username, email, roles) firmada criptográficamente. El microservicio verifica la firma para asegurar que es legítimo."

**¿Cómo funciona @PreAuthorize?**
> "Es una anotación que verifica los permisos antes de ejecutar el método. `@PreAuthorize('hasRole('ADMIN')')` solo permite acceso si el token tiene el rol ADMIN. Si no, devuelve 403 Forbidden."

**¿Por qué 401 vs 403?**
> "401 Unauthorized: No enviaste token (no estás autenticado). 403 Forbidden: Enviaste token válido pero no tienes permiso (estás autenticado pero no autorizado)."

---

## 🎉 RESUMEN

### ✅ Configuración de realm y roles
- Realm `votaciones-realm` con roles ADMIN y USER
- Usuarios admin y user creados
- Panel de administración accesible

### ✅ Integración con microservicios
- OAuth2 Resource Server configurado
- JWT Decoder valida tokens de Keycloak
- Roles extraídos del token automáticamente

### ✅ Protección de endpoints
- Endpoints protegidos con @PreAuthorize
- ADMIN: Acceso completo (GET, POST, PUT, DELETE)
- USER: Solo lectura (GET)
- Sin token: 401 Unauthorized
- Token sin permiso: 403 Forbidden

---

**✅ CRITERIO 5: KEYCLOAK - 100% COMPLETADO**

