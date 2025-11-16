# 📋 COMANDOS PARA PRESENTACIÓN - BOLIVIAN DIGITALIZATION VOTES

## 🎯 RÚBRICA COMPLETA CON EVIDENCIA

---

## **1️⃣ PERSISTENCIA DE DATOS**

### 1.1 Verificar Conexión a BD Funcional
```powershell
docker-compose ps postgres-db-candidatos
```
**Esperado:** Status = `Up (healthy)`

### 1.2 Ver Logs de Conexión
```powershell
docker-compose logs candidatos-service | Select-String "Started\|Connected"
```
**Esperado:** Líneas de inicio exitoso

### 1.3 GET - Leer datos (SIN TOKEN - debe retornar 401)
```powershell
Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos" -Method GET
```
**Esperado:** `401 Unauthorized`

### 1.4 Obtener Token JWT
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8888/realms/master/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body @{grant_type='password'; client_id='admin-cli'; username='admin'; password='admin'}
$token = $response.access_token
Write-Host "Token: $($token.Substring(0,50))..."
```
**Esperado:** Token obtenido exitosamente

### 1.5 GET - Leer datos (CON TOKEN - debe retornar 200)
```powershell
Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos" -Method GET -Headers @{Authorization="Bearer $token"}
```
**Esperado:** `200 OK` con lista de candidatos

### 1.6 POST - Crear Candidato (CRUD Create)
```powershell
$body = @{
  partido='DEMO-TEST'
  nombreCompletoPresidente='Presidenta Demo'
  nombreCompletoVicepresidente='Vicepresidenta Demo'
  carnetPresidente='CI123456'
  carnetVicepresidente='CI654321'
  fechaNacimientoPresidente='1980-01-01'
  fechaNacimientoVicepresidente='1980-01-02'
  correoElectronico='demo@test.bo'
  descripcion='Candidatura de demostración'
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos" -Method POST -ContentType "application/json" -Body $body -Headers @{Authorization="Bearer $token"}
Write-Host "Candidato creado con ID: $($created.id)"
```
**Esperado:** `201 Created` con ID asignado

### 1.7 GET por ID - Verificar que se guardó
```powershell
$idCreado = $created.id
Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos/$idCreado" -Method GET -Headers @{Authorization="Bearer $token"} | ConvertTo-Json
```
**Esperado:** Devuelve el candidato guardado

### 1.8 PUT - Actualizar Candidato (CRUD Update)
```powershell
$bodyUpdate = @{
  partido='DEMO-ACTUALIZADO'
  nombreCompletoPresidente='Presidenta Actualizada'
  nombreCompletoVicepresidente='Vicepresidenta Demo'
  carnetPresidente='CI123456'
  carnetVicepresidente='CI654321'
  fechaNacimientoPresidente='1980-01-01'
  fechaNacimientoVicepresidente='1980-01-02'
  correoElectronico='demo@test.bo'
  descripcion='Candidatura actualizada'
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos/$idCreado" -Method PUT -ContentType "application/json" -Body $bodyUpdate -Headers @{Authorization="Bearer $token"} | ConvertTo-Json
```
**Esperado:** `200 OK` con datos actualizados

### 1.9 DELETE - Eliminar Candidato (CRUD Delete)
```powershell
Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos/$idCreado" -Method DELETE -Headers @{Authorization="Bearer $token"}
Write-Host "Candidato eliminado exitosamente"
```
**Esperado:** `204 No Content`

### 1.10 Verificar Eliminación
```powershell
try {
  Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos/$idCreado" -Method GET -Headers @{Authorization="Bearer $token"}
} catch {
  Write-Host "✅ Correcto - Candidato no encontrado (404)"
}
```
**Esperado:** `404 Not Found`

### 1.11 Mostrar Código Repository
```powershell
notepad "candidatos\src\main\java\com\votaciones\candidatos\repository\CandidatoRepository.java"
```
**Ver:** Consultas Native Query, Derived Query, etc.

---

## **2️⃣ EUREKA SERVER (DISCOVERY)**

### 2.1 Acceder al Dashboard
```
http://localhost:8761
```
**Ver:** Todos los microservicios registrados

### 2.2 Verificar que está UP
```powershell
docker-compose ps eureka-server
```
**Esperado:** Status = `Up`

### 2.3 Ver servicios registrados programáticamente
```powershell
Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Method GET | ConvertTo-Json | Select-String "CANDIDATOS\|USUARIOS\|NOTIFICACIONES"
```
**Esperado:** Todos los servicios visibles

---

## **3️⃣ EDGE SERVER / GATEWAY**

### 3.1 Acceder a Swagger por Gateway (SSL)
```
https://localhost:8443/openapi/swagger-ui.html
(Acepta el certificado auto-firmado)
```
**Ver:** Documentación API

### 3.2 GET por Gateway (CON TOKEN)
```powershell
Invoke-RestMethod -Uri "https://localhost:8443/ms-candidatos/v1/api/candidatos" -Method GET -Headers @{Authorization="Bearer $token"} -SkipCertificateCheck | ConvertTo-Json | Select-String "partido" | Select-Object -First 3
```
**Esperado:** Datos redirigidos correctamente por gateway

### 3.3 Verificar rutas configuradas
```powershell
notepad "api-gateway\src\main\resources\application.yml"
```
**Ver:** 
- Predicados (Path)
- Filtros (StripPrefix, RewritePath)
- Rutas (lb://MS-CANDIDATOS, etc)

---

## **4️⃣ DOCKER & DOCKER-COMPOSE**

### 4.1 Ver todos los contenedores
```powershell
docker-compose ps
```
**Esperado:** Todos con Status = `Up`

### 4.2 Ver archivos Docker
```powershell
# Gateway
notepad "api-gateway\Dockerfile"

# Candidatos
notepad "candidatos\Dockerfile"

# Eureka
notepad "eureka-server\Dockerfile"
```

### 4.3 Ver docker-compose.yml
```powershell
notepad "docker-compose.yml"
```
**Ver:**
- Definición de todos los servicios
- Configuración de redes
- Variables de ambiente
- Puertos expuestos

---

## **5️⃣ KEYCLOAK - OAUTH2 & SEGURIDAD**

### 5.1 Acceder a Admin de Keycloak
```
http://localhost:8888/admin
Usuario: admin
Password: admin
```
**Ver:** Realm "master", usuarios, roles

### 5.2 Token sin autenticación (DEBE FALLAR)
```powershell
Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos" -Method GET
```
**Esperado:** `401 Unauthorized`

### 5.3 Obtener Token
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8888/realms/master/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body @{grant_type='password'; client_id='admin-cli'; username='admin'; password='admin'}
$token = $response.access_token
Write-Host "✅ Token obtenido"
```

### 5.4 Con Token - DEBE FUNCIONAR
```powershell
Invoke-RestMethod -Uri "http://localhost:8082/api/candidatos" -Method GET -Headers @{Authorization="Bearer $token"} | ConvertTo-Json | Select-String "id\|partido" | Select-Object -First 5
```
**Esperado:** `200 OK` con datos

### 5.5 Mostrar SecurityConfig
```powershell
notepad "candidatos\src\main\java\com\votaciones\candidatos\config\SecurityConfig.java"
```
**Ver:**
- @EnableMethodSecurity
- .authenticated()
- OAuth2ResourceServer
- JwtDecoder

### 5.6 Mostrar aplicación.yaml con OAuth2
```powershell
notepad "candidatos\src\main\resources\application.yaml"
```
**Ver:** 
- jwt.jwk-set-uri
- Configuración OAuth2

---

## 📊 PUERTOS PRINCIPALES

```
Keycloak:           http://localhost:8888
Eureka:             http://localhost:8761
API Gateway:        https://localhost:8443
ms-candidatos:      http://localhost:8082
ms-usuarios:        http://localhost:8081
PostgreSQL (BD):    localhost:5433
Kafka:              localhost:9092
```

---

## ✅ CHECKLIST FINAL

- [ ] Persistencia BD funciona (CRUD completo)
- [ ] Eureka registra servicios
- [ ] Gateway rutea correctamente
- [ ] Docker-compose levanta sin errores
- [ ] Keycloak protege endpoints
- [ ] Token JWT valida correctamente
- [ ] Swagger accesible por Gateway
- [ ] Logs muestran conexiones exitosas

---

**Generado:** 27 de Octubre de 2025
**Proyecto:** BolivianDigitalizationVotes
**Rama:** candidatos2
