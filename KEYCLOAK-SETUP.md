# 🔐 Guía de Configuración de Keycloak

Esta guía te mostrará paso a paso cómo configurar Keycloak para proteger tu arquitectura de microservicios.

## 📋 Prerequisitos

- Docker y Docker Compose instalados
- Postman o Thunder Client para pruebas
- Servicios compilados con Maven
- **Navegador en modo incógnito** (recomendado para evitar problemas de caché)

## ⚠️ Nota importante sobre errores de consola

Si ves el error "Network response was not OK" en la consola de Keycloak:
1. **Refresca la página** (Ctrl+F5 o Cmd+Shift+R)
2. **Usa modo incógnito/privado** en tu navegador
3. **Espera 1-2 minutos** después de que Keycloak inicie
4. **Verifica que PostgreSQL esté corriendo**: `docker-compose ps`

---

## 🚀 Paso 1: Levantar Keycloak con Docker Compose

```bash
# En la raíz del proyecto
docker-compose up keycloak
```

**Espera** aproximadamente 1-2 minutos hasta que veas en los logs:
```
keycloak  | ... KC Listening on: http://0.0.0.0:8080
```

**Accede a Keycloak**:
```
URL: http://localhost:8090
Usuario: admin
Contraseña: admin
```

---

## 🏗️ Paso 2: Crear el Realm "votaciones"

### 2.1 Crear Realm

1. En la consola de Keycloak, en el menú izquierdo superior, haz clic en el dropdown que dice **"master"**
2. Haz clic en **"Create Realm"**
3. Configura:
   - **Realm name**: `votaciones`
   - **Enabled**: ON
4. Haz clic en **"Create"**

### 2.2 Configurar Realm

En **Realm Settings**:
- **General** → **Frontend URL**: `http://localhost:8090`
- **Login** → Asegúrate que todo esté habilitado
- **Tokens** → Revisa configuraciones por defecto

---

## 👥 Paso 3: Crear Roles

1. En el menú izquierdo, ve a **Realm roles**
2. Haz clic en **"Create role"**

### Crear rol "USER":
- **Role name**: `USER`
- **Description**: `Rol básico de usuario con permisos de lectura`
- Haz clic en **"Save"**

### Crear rol "ADMIN":
- **Role name**: `ADMIN`
- **Description**: `Rol de administrador con permisos completos`
- Haz clic en **"Save"**

---

## 🔑 Paso 4: Crear Client "votaciones-client"

### 4.1 Crear Client

1. En el menú izquierdo, ve a **Clients**
2. Haz clic en **"Create client"**
3. **General Settings**:
   - **Client type**: `OpenID Connect`
   - **Client ID**: `votaciones-client`
   - Haz clic en **"Next"**

4. **Capability config**:
   - **Client authentication**: `ON`
   - **Authorization**: `OFF`
   - **Authentication flow**:
     - ✅ Standard flow
     - ✅ Direct access grants
     - ✅ Service accounts roles
   - Haz clic en **"Next"**

5. **Login settings**:
   - **Root URL**: `http://localhost:8080`
   - **Home URL**: `http://localhost:8080`
   - **Valid redirect URIs**: 
     ```
     http://localhost:8080/*
     http://localhost:8090/*
     ```
   - **Valid post logout redirect URIs**: 
     ```
     http://localhost:8080/*
     ```
   - **Web origins**: `*`
   - Haz clic en **"Save"**

### 4.2 Obtener Client Secret

1. Ve a la pestaña **"Credentials"** del client `votaciones-client`
2. **Copia** el **Client secret** (lo necesitarás para obtener tokens)
3. Guárdalo en un lugar seguro (ejemplo: `9K7h3jR2...`)

---

## 👤 Paso 5: Crear Usuarios de Prueba

### 5.1 Crear Usuario "admin"

1. En el menú izquierdo, ve a **Users**
2. Haz clic en **"Add user"**
3. Configura:
   - **Username**: `admin`
   - **Email**: `admin@votaciones.com`
   - **First name**: `Admin`
   - **Last name**: `Sistema`
   - **Email verified**: ON
   - **Enabled**: ON
4. Haz clic en **"Create"**

#### Asignar contraseña:
1. Ve a la pestaña **"Credentials"**
2. Haz clic en **"Set password"**
3. Configura:
   - **Password**: `admin123`
   - **Password confirmation**: `admin123`
   - **Temporary**: OFF
4. Haz clic en **"Save"**

#### Asignar rol ADMIN:
1. Ve a la pestaña **"Role mapping"**
2. Haz clic en **"Assign role"**
3. Busca y selecciona **"ADMIN"**
4. Haz clic en **"Assign"**

### 5.2 Crear Usuario "user"

Repite el mismo proceso para un usuario normal:
- **Username**: `user`
- **Email**: `user@votaciones.com`
- **Password**: `user123` (Temporary: OFF)
- **Rol**: USER

---

## 🧪 Paso 6: Probar la Autenticación

### 6.1 Obtener Token (Usuario ADMIN)

**Endpoint**: `POST http://localhost:8090/realms/votaciones/protocol/openid-connect/token`

**Headers**:
```
Content-Type: application/x-www-form-urlencoded
```

**Body** (x-www-form-urlencoded):
```
client_id=votaciones-client
client_secret=<TU_CLIENT_SECRET>
grant_type=password
username=admin
password=admin123
```

**Respuesta esperada**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "scope": "profile email"
}
```

**Copia el `access_token`** para usarlo en las peticiones.

### 6.2 Obtener Token (Usuario USER)

Repite lo mismo pero con:
```
username=user
password=user123
```

---

## 🔒 Paso 7: Probar Endpoints Protegidos

### 7.1 Sin Token (debe fallar)

```bash
GET http://localhost:8080/api/auditoria/eventos
```

**Resultado esperado**: `401 Unauthorized`

### 7.2 Con Token de USER (debe funcionar para GET)

```bash
GET http://localhost:8080/api/auditoria/eventos
Authorization: Bearer <ACCESS_TOKEN_DE_USER>
```

**Resultado esperado**: `200 OK` con datos

### 7.3 Con Token de USER intentando POST (debe fallar)

```bash
POST http://localhost:8080/api/auditoria
Authorization: Bearer <ACCESS_TOKEN_DE_USER>
Content-Type: application/json

{
  "tipo": "VOTO",
  "severidad": "INFO",
  "modulo": "votaciones",
  "usuario": "12345678",
  "ip": "192.168.1.15",
  "correlacion": "REQ-2025-001",
  "detalle": "Test"
}
```

**Resultado esperado**: `403 Forbidden`

### 7.4 Con Token de ADMIN intentando POST (debe funcionar)

```bash
POST http://localhost:8080/api/auditoria
Authorization: Bearer <ACCESS_TOKEN_DE_ADMIN>
Content-Type: application/json

{
  "tipo": "VOTO",
  "severidad": "INFO",
  "modulo": "votaciones",
  "usuario": "12345678",
  "ip": "192.168.1.15",
  "correlacion": "REQ-2025-002",
  "detalle": "Test con ADMIN"
}
```

**Resultado esperado**: `200 OK` con el registro creado

---

## 📊 Paso 8: Verificar Configuración Completa

### Checklist de Keycloak:

- [ ] Keycloak corriendo en http://localhost:8090
- [ ] Realm "votaciones" creado
- [ ] Roles "USER" y "ADMIN" creados
- [ ] Client "votaciones-client" configurado
- [ ] Client secret copiado
- [ ] Usuario "admin" creado con rol ADMIN
- [ ] Usuario "user" creado con rol USER
- [ ] Token de admin obtenido exitosamente
- [ ] Token de user obtenido exitosamente
- [ ] GET funciona con ambos tokens
- [ ] POST funciona solo con token de admin
- [ ] POST falla con token de user (403)

---

## 🐳 Paso 9: Levantar Todo el Sistema

Una vez que Keycloak esté configurado:

```bash
# Detener todo
docker-compose down

# Recompilar servicios
cd api-gateway
mvn clean package -DskipTests
cd ../auditoria_registros-services
mvn clean package -DskipTests
cd ..

# Levantar todo el sistema
docker-compose up --build
```

**Orden de inicio**:
1. PostgreSQL (ambas instancias)
2. Keycloak
3. Eureka Server
4. Microservicio de Auditoría
5. API Gateway

**URLs Importantes**:
- Keycloak: http://localhost:8090
- Eureka: http://localhost:8761
- API Gateway: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

---

## 🔍 Troubleshooting

### Problema: "Invalid issuer"

**Causa**: Keycloak no está listo o la URL del issuer es incorrecta.

**Solución**:
1. Verifica que Keycloak esté corriendo: `docker-compose logs keycloak`
2. Accede a: `http://localhost:8090/realms/votaciones/.well-known/openid-configuration`
3. Debe retornar un JSON con la configuración del realm

### Problema: "401 Unauthorized" con token válido

**Causa**: El token puede haber expirado o el issuer-uri no coincide.

**Solución**:
1. Genera un nuevo token
2. Verifica que la URL del issuer sea exactamente: `http://keycloak:8080/realms/votaciones` (en Docker)
3. En local: `http://localhost:8090/realms/votaciones`

### Problema: "403 Forbidden" con rol correcto

**Causa**: Los roles no se están mapeando correctamente.

**Solución**:
1. Verifica en Keycloak que el usuario tenga el rol asignado
2. Decodifica el JWT en https://jwt.io y verifica que contenga los roles
3. Los roles deben aparecer en `realm_access.roles` o `resource_access.<client>.roles`

---

## 📝 Colección de Postman

Importa esta colección en Postman:

```json
{
  "info": {
    "name": "Votaciones - Keycloak",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Get Token ADMIN",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "urlencoded",
          "urlencoded": [
            {"key": "client_id", "value": "votaciones-client"},
            {"key": "client_secret", "value": "{{client_secret}}"},
            {"key": "grant_type", "value": "password"},
            {"key": "username", "value": "admin"},
            {"key": "password", "value": "admin123"}
          ]
        },
        "url": "http://localhost:8090/realms/votaciones/protocol/openid-connect/token"
      }
    },
    {
      "name": "2. Get Eventos (Protected)",
      "request": {
        "method": "GET",
        "header": [
          {"key": "Authorization", "value": "Bearer {{access_token}}"}
        ],
        "url": "http://localhost:8080/api/auditoria/eventos"
      }
    },
    {
      "name": "3. Create Evento (ADMIN only)",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{access_token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tipo\": \"VOTO\",\n  \"severidad\": \"INFO\",\n  \"modulo\": \"votaciones\",\n  \"usuario\": \"12345678\",\n  \"ip\": \"192.168.1.15\",\n  \"correlacion\": \"REQ-2025-001\",\n  \"detalle\": \"Test con Keycloak\"\n}"
        },
        "url": "http://localhost:8080/api/auditoria"
      }
    }
  ]
}
```

---

## ✅ Resultado Final

Con Keycloak configurado correctamente:

- ✅ **Autenticación OAuth2/OIDC** funcionando
- ✅ **Tokens JWT** emitidos por Keycloak
- ✅ **Roles y permisos** implementados
- ✅ **Gateway** valida tokens antes de enrutar
- ✅ **Microservicios** validan tokens y roles
- ✅ **Endpoints protegidos** según roles (USER/ADMIN)
- ✅ **401 sin token**, **403 sin permisos**, **200 con permisos**

---

## 🎯 Próximos Pasos

1. Implementar refresh tokens
2. Agregar más roles específicos (VOTER, AUDITOR, etc.)
3. Proteger Eureka Dashboard
4. Implementar logout
5. Agregar HTTPS

---

**¡Felicidades! Tu arquitectura de microservicios ahora está protegida con Keycloak** 🎉
