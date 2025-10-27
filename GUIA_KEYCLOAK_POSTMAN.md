# 🔐 Guía Completa: Keycloak + Postman

## 📋 Índice
1. [¿Qué es Keycloak?](#qué-es-keycloak)
2. [Configuración Actual](#configuración-actual)
3. [Paso a Paso: Probar con Postman](#paso-a-paso-probar-con-postman)
4. [Ejemplos de Peticiones](#ejemplos-de-peticiones)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 ¿Qué es Keycloak?

**Keycloak** es un servidor de autenticación y autorización que:
- Genera **tokens JWT** (JSON Web Tokens) para autenticar usuarios
- Maneja **roles** (ADMIN, USER) para controlar permisos
- Protege tus endpoints para que solo usuarios autenticados puedan acceder

### ¿Cómo funciona?
```
1. Usuario solicita token → Keycloak
2. Keycloak valida credenciales → Devuelve token JWT
3. Usuario envía token en petición → Microservicio
4. Microservicio valida token → Permite o deniega acceso
```

---

## ⚙️ Configuración Actual

### Usuarios Configurados
Tu archivo `keycloak/votaciones-realm.json` ya tiene 2 usuarios:

| Usuario | Contraseña | Rol   | Email                  |
|---------|------------|-------|------------------------|
| admin   | admin123   | ADMIN | admin@votaciones.bo    |
| user    | user123    | USER  | user@votaciones.bo     |

### Endpoints Protegidos

#### Microservicio Votaciones (`ms-votaciones`)
- **POST** `/api/votaciones` → Requiere rol `ADMIN`
- **GET** `/api/votaciones` → Requiere rol `USER` o `ADMIN`
- **GET** `/api/votaciones/{id}` → Requiere rol `USER` o `ADMIN`

#### Microservicio Resultados (`ms-resultados`)
- **POST** `/api/resultados` → Requiere rol `ADMIN`
- **PUT** `/api/resultados/{id}` → Requiere rol `ADMIN`
- **DELETE** `/api/resultados/{id}` → Requiere rol `ADMIN`
- **GET** `/api/resultados` → Requiere rol `USER` o `ADMIN`
- **GET** `/api/resultados/{id}` → Requiere rol `USER` o `ADMIN`
- **GET** `/api/resultados/departamento/{departamento}` → Requiere rol `USER` o `ADMIN`

---

## 🚀 Paso a Paso: Probar con Postman

### Paso 1: Levantar los Servicios

```bash
# En la raíz del proyecto
docker-compose up -d
```

Espera 30-60 segundos para que todos los servicios estén listos.

### Paso 2: Verificar que Keycloak está Funcionando

Abre tu navegador y ve a:
```
http://localhost:8180/auth
```

Deberías ver la página de Keycloak. Si ves esto, ¡está funcionando! ✅

---

### Paso 3: Obtener Token JWT con Postman

#### 3.1 Crear Nueva Petición en Postman

1. Abre Postman
2. Crea una nueva petición **POST**
3. URL: 
```
http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
```

#### 3.2 Configurar Headers

En la pestaña **Headers**, agrega:

| Key          | Value                                 |
|--------------|---------------------------------------|
| Content-Type | application/x-www-form-urlencoded     |

#### 3.3 Configurar Body

En la pestaña **Body**:
- Selecciona **x-www-form-urlencoded**
- Agrega los siguientes parámetros:

**Para obtener token de ADMIN:**
| Key          | Value              |
|--------------|-------------------|
| client_id    | votaciones-client |
| username     | admin             |
| password     | admin123          |
| grant_type   | password          |

**Para obtener token de USER:**
| Key          | Value              |
|--------------|-------------------|
| client_id    | votaciones-client |
| username     | user              |
| password     | user123           |
| grant_type   | password          |

#### 3.4 Enviar Petición

Haz clic en **Send**. Deberías recibir una respuesta como esta:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI...",
  "expires_in": 3600,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "...",
  "scope": "profile email"
}
```

**¡Copia el `access_token`!** Lo necesitarás para las siguientes peticiones.

---

### Paso 4: Usar el Token en tus Peticiones

#### 4.1 Crear Petición a tu Microservicio

Ejemplo: Listar resultados

1. Crea nueva petición **GET**
2. URL (a través del Gateway):
```
http://localhost:8080/ms-resultados/api/resultados
```

#### 4.2 Agregar Token en Headers

En la pestaña **Headers**, agrega:

| Key           | Value                    |
|---------------|--------------------------|
| Authorization | Bearer TU_TOKEN_AQUI     |

**IMPORTANTE:** Reemplaza `TU_TOKEN_AQUI` con el `access_token` que copiaste.

Debe verse así:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk...
```

#### 4.3 Enviar Petición

Haz clic en **Send**. Si todo está correcto:
- ✅ Con token válido → Recibirás los datos (200 OK)
- ❌ Sin token → Recibirás 401 Unauthorized
- ❌ Con token de USER en endpoint de ADMIN → Recibirás 403 Forbidden

---

## 📝 Ejemplos de Peticiones

### Ejemplo 1: Listar Resultados (USER o ADMIN)

```
GET http://localhost:8080/ms-resultados/api/resultados
Headers:
  Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resultado esperado:** 200 OK con lista de resultados

---

### Ejemplo 2: Crear Resultado (Solo ADMIN)

```
POST http://localhost:8080/ms-resultados/api/resultados
Headers:
  Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9... (token de admin)
  Content-Type: application/json
Body:
{
  "numeroMesa": 1001,
  "departamento": "La Paz",
  "provincia": "Murillo",
  "municipio": "La Paz",
  "recinto": "Colegio Nacional",
  "inscritos": 500,
  "votosValidos": 450,
  "votosNulos": 30,
  "votosBlancos": 20
}
```

**Resultado esperado:** 201 Created con el resultado creado

---

### Ejemplo 3: Buscar por Departamento (USER o ADMIN)

```
GET http://localhost:8080/ms-resultados/api/resultados/departamento/La Paz
Headers:
  Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resultado esperado:** 200 OK con resultados de La Paz

---

### Ejemplo 4: Probar Acceso Denegado

Intenta crear un resultado con token de USER:

```
POST http://localhost:8080/ms-resultados/api/resultados
Headers:
  Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9... (token de user)
  Content-Type: application/json
Body: { ... }
```

**Resultado esperado:** 403 Forbidden (porque USER no tiene permiso para crear)

---

## 🔍 Verificar Roles en el Token

Puedes decodificar tu token JWT para ver qué roles tiene:

1. Ve a: https://jwt.io/
2. Pega tu `access_token` en el campo "Encoded"
3. En la sección "Payload", busca:

```json
{
  "realm_access": {
    "roles": [
      "ADMIN"  // o "USER"
    ]
  }
}
```

---

## 🛠️ Solución de Problemas

### Problema 1: "401 Unauthorized"

**Causa:** No enviaste el token o el token expiró.

**Solución:**
1. Verifica que agregaste el header `Authorization: Bearer TOKEN`
2. Genera un nuevo token (los tokens expiran en 1 hora)

---

### Problema 2: "403 Forbidden"

**Causa:** El usuario no tiene el rol necesario.

**Solución:**
1. Verifica qué rol requiere el endpoint (mira el `@PreAuthorize` en el controller)
2. Usa el usuario correcto:
   - Para endpoints con `@PreAuthorize("hasRole('ADMIN')")` → usa token de `admin`
   - Para endpoints con `@PreAuthorize("hasAnyRole('USER', 'ADMIN')")` → usa cualquier token

---

### Problema 3: Keycloak no responde

**Causa:** Keycloak no está levantado o no terminó de iniciar.

**Solución:**
```bash
# Ver logs de Keycloak
docker logs keycloak

# Reiniciar Keycloak
docker-compose restart keycloak

# Esperar 30 segundos y probar de nuevo
```

---

### Problema 4: "Connection refused" al obtener token

**Causa:** La URL de Keycloak es incorrecta.

**Solución:**
Verifica que uses:
```
http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
```

NO uses:
- ~~http://localhost:8080~~ (ese es el gateway)
- ~~http://keycloak:8080~~ (ese es el nombre interno de Docker)

---

## 📊 Resumen de URLs

| Servicio                  | URL                                                                                           |
|---------------------------|-----------------------------------------------------------------------------------------------|
| Keycloak Admin            | http://localhost:8180/auth                                                                    |
| Obtener Token             | http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token             |
| Gateway                   | http://localhost:8080                                                                         |
| Resultados (via Gateway)  | http://localhost:8080/ms-resultados/api/resultados                                            |
| Votaciones (via Gateway)  | http://localhost:8080/ms-votaciones/api/votaciones                                            |
| Eureka Dashboard          | http://localhost:8761                                                                         |

---

## ✅ Checklist para Evidencia

Para cumplir con el criterio de Keycloak, asegúrate de tener:

- [ ] Keycloak levantado y accesible en http://localhost:8180/auth
- [ ] Realm `votaciones-realm` configurado con roles ADMIN y USER
- [ ] Usuarios `admin` y `user` creados
- [ ] Endpoints protegidos con `@PreAuthorize`
- [ ] Captura de Postman obteniendo token exitosamente
- [ ] Captura de Postman accediendo a endpoint con token válido (200 OK)
- [ ] Captura de Postman con error 401 (sin token)
- [ ] Captura de Postman con error 403 (token sin permisos)

---

## 🎓 Conceptos Clave

- **Token JWT:** Es como un "pase VIP" que demuestra quién eres y qué permisos tienes
- **Bearer Token:** Tipo de autenticación donde envías el token en el header `Authorization`
- **Rol ADMIN:** Puede crear, modificar y eliminar datos
- **Rol USER:** Solo puede leer datos
- **@PreAuthorize:** Anotación de Spring que protege endpoints según roles

---

## 📞 Comandos Útiles

```bash
# Ver todos los contenedores
docker ps

# Ver logs de Keycloak
docker logs keycloak

# Ver logs de resultados
docker logs ms-resultados

# Reiniciar todo
docker-compose restart

# Parar todo
docker-compose down

# Levantar todo de nuevo
docker-compose up -d
```

---

¡Listo! Con esta guía deberías poder probar Keycloak sin problemas. 🚀
