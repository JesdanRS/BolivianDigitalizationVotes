# 🚀 PASOS RÁPIDOS - Keycloak en 5 Minutos

## ✅ Paso 1: Levantar Servicios (2 min)

```bash
# En la raíz del proyecto
docker-compose up -d

# Esperar 30-60 segundos
```

Verifica que estén corriendo:
```bash
docker ps
```

Deberías ver: `keycloak`, `ms-resultados`, `eureka-server`, `api-gateway`, `bd-resultados`

---

## ✅ Paso 2: Obtener Token en Postman (1 min)

### Opción A: Importar Colección (RECOMENDADO)

1. Abre Postman
2. Click en **Import**
3. Selecciona el archivo: `Keycloak_Resultados.postman_collection.json`
4. Ve a la carpeta **"1. Autenticación Keycloak"**
5. Ejecuta **"Obtener Token - ADMIN"**
6. ¡Listo! El token se guarda automáticamente

### Opción B: Manual

1. Crea petición **POST** en Postman
2. URL: `http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token`
3. Headers:
   - `Content-Type: application/x-www-form-urlencoded`
4. Body (x-www-form-urlencoded):
   ```
   client_id: votaciones-client
   username: admin
   password: admin123
   grant_type: password
   ```
5. Click **Send**
6. Copia el `access_token` de la respuesta

---

## ✅ Paso 3: Probar Endpoint Protegido (1 min)

1. Crea petición **GET** en Postman
2. URL: `http://localhost:8080/ms-resultados/api/resultados`
3. Headers:
   ```
   Authorization: Bearer TU_TOKEN_AQUI
   ```
4. Click **Send**
5. ✅ Deberías recibir **200 OK** con datos

---

## ✅ Paso 4: Probar Seguridad (1 min)

### Prueba 1: Sin Token (debe dar 401)
```
GET http://localhost:8080/ms-resultados/api/resultados
(Sin header Authorization)
```
❌ Resultado esperado: **401 Unauthorized**

### Prueba 2: USER intenta crear (debe dar 403)
```
POST http://localhost:8080/ms-resultados/api/resultados
Authorization: Bearer TOKEN_DE_USER
Body: { ... datos ... }
```
❌ Resultado esperado: **403 Forbidden**

---

## 📸 Capturas para Evidencia

Toma screenshots de:

1. ✅ **Token obtenido exitosamente** (respuesta con `access_token`)
2. ✅ **GET con token válido** (200 OK con datos)
3. ❌ **GET sin token** (401 Unauthorized)
4. ❌ **POST con token USER** (403 Forbidden)
5. ✅ **Panel de Keycloak** (http://localhost:8180/auth)

---

## 🎯 Resumen de Endpoints para Probar

| Método | URL | Rol Requerido | Resultado Esperado |
|--------|-----|---------------|-------------------|
| GET | `/api/resultados` | USER o ADMIN | 200 OK |
| GET | `/api/resultados/1` | USER o ADMIN | 200 OK |
| POST | `/api/resultados` | ADMIN | 201 Created |
| PUT | `/api/resultados/1` | ADMIN | 200 OK |
| DELETE | `/api/resultados/1` | ADMIN | 204 No Content |
| GET | `/api/resultados/departamento/La Paz` | USER o ADMIN | 200 OK |

**Nota:** Todos los endpoints deben accederse a través del Gateway: `http://localhost:8080/ms-resultados/...`

---

## 🆘 Solución Rápida de Problemas

### Keycloak no responde
```bash
docker logs keycloak
docker-compose restart keycloak
# Esperar 30 segundos
```

### Token expiró (401 después de 1 hora)
- Simplemente obtén un nuevo token (Paso 2)

### 403 Forbidden
- Verifica que uses el token correcto:
  - **ADMIN** para POST/PUT/DELETE
  - **USER** o **ADMIN** para GET

### No hay datos en GET
- Primero crea datos con POST usando token de ADMIN

---

## 📋 Checklist Final

- [ ] Docker containers corriendo
- [ ] Token obtenido exitosamente
- [ ] GET funciona con token (200 OK)
- [ ] GET sin token falla (401)
- [ ] POST con USER falla (403)
- [ ] POST con ADMIN funciona (201)
- [ ] Capturas de pantalla tomadas

---

## 🎓 Usuarios Disponibles

| Usuario | Contraseña | Rol | Para qué usar |
|---------|------------|-----|---------------|
| admin | admin123 | ADMIN | Crear, modificar, eliminar |
| user | user123 | USER | Solo consultar |

---

## 🔗 URLs Importantes

- **Obtener Token:** http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
- **API Gateway:** http://localhost:8080
- **Resultados:** http://localhost:8080/ms-resultados/api/resultados
- **Swagger:** http://localhost:8080/ms-resultados/swagger-ui.html
- **Keycloak Admin:** http://localhost:8180/auth (admin/admin)
- **Eureka:** http://localhost:8761

---

¡Listo! Con estos pasos deberías tener todo funcionando en menos de 5 minutos. 🎉
