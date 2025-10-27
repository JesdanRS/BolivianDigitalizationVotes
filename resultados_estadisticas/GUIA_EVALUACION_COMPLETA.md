# 🎯 GUÍA COMPLETA DE EVALUACIÓN - Microservicio Resultados y Estadísticas

## 📋 ÍNDICE RÁPIDO
1. [Inicialización del Sistema](#1-inicialización-del-sistema)
2. [Criterio 1: Persistencia de Datos](#2-criterio-1-persistencia-de-datos)
3. [Criterio 2: Eureka Server](#3-criterio-2-eureka-server)
4. [Criterio 3: Edge Server (Gateway)](#4-criterio-3-edge-server-gateway)
5. [Criterio 4: Docker](#5-criterio-4-docker)
6. [Criterio 5: Keycloak](#6-criterio-5-keycloak)

---

## 1. INICIALIZACIÓN DEL SISTEMA

### Paso 1: Levantar todos los servicios
```bash
# En la raíz del proyecto (donde está docker-compose.yml)
cd "d:\UCB\8vo Semestre\Taller Software\BolivianDigitalizationVotes"
docker-compose up -d
```

### Paso 2: Verificar que todo esté corriendo
```bash
docker ps
```

**Deberías ver estos contenedores:**
- `keycloak` (puerto 8180)
- `ms-resultados` (puerto 8083)
- `bd-resultados` (puerto 5434)
- `eureka-server` (puerto 8761)
- `api-gateway` (puerto 8080)

### Paso 3: Esperar 30-60 segundos
Los servicios necesitan tiempo para inicializarse completamente.

### Paso 4: Importar colección de Postman
1. Abre Postman
2. Click en **Import**
3. Selecciona: `Keycloak_Resultados.postman_collection.json` (en la raíz del proyecto)
4. La colección se importará con todas las peticiones pre-configuradas

---

## 2. CRITERIO 1: PERSISTENCIA DE DATOS

### ✅ Qué demostrar:
- Conexión a PostgreSQL funcional
- CRUD completo con datos reales
- Repository con consultas: Derived Query, JPQL Query, Native Query

### 🎬 DEMOSTRACIÓN EN VIVO

#### A. Verificar conexión a BD
```bash
docker logs ms-resultados | grep "HikariPool"
```
**Resultado esperado:** Debe mostrar "HikariPool-1 - Start completed"

#### B. Crear un resultado (POST)
**En Postman:**
1. Carpeta: **"2. CRUD Resultados (con ADMIN)"**
2. Petición: **"Crear Resultado (ADMIN)"**
3. Primero obtén token de ADMIN (carpeta "1. Autenticación Keycloak")
4. Ejecuta la petición

**Request:**
```
POST http://localhost:8080/ms-resultados/api/resultados
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

Body:
{
  "numeroMesa": 1001,
  "departamento": "La Paz",
  "provincia": "Murillo",
  "municipio": "La Paz",
  "recinto": "Colegio Nacional Don Bosco",
  "inscritos": 500,
  "votosValidos": 450,
  "votosNulos": 30,
  "votosBlancos": 20
}
```

**Resultado esperado:** `201 Created` con el objeto creado

#### C. Listar resultados (GET)
**En Postman:**
1. Petición: **"Listar Resultados (ADMIN)"**
2. Ejecuta

**Resultado esperado:** `200 OK` con array de resultados desde PostgreSQL

#### D. Obtener por ID (GET)
**En Postman:**
1. Petición: **"Obtener Resultado por ID (ADMIN)"**
2. Ejecuta

**Resultado esperado:** `200 OK` con el resultado específico

#### E. Actualizar resultado (PUT)
**En Postman:**
1. Petición: **"Actualizar Resultado (ADMIN)"**
2. Ejecuta

**Resultado esperado:** `200 OK` con el resultado actualizado

#### F. Eliminar resultado (DELETE)
**En Postman:**
1. Petición: **"Eliminar Resultado (ADMIN)"**
2. Ejecuta

**Resultado esperado:** `204 No Content`

### 📊 Demostrar Consultas del Repository

#### Derived Query
**En Postman:**
1. Carpeta: **"3. Consultas (con USER)"**
2. Petición: **"Buscar por Departamento (USER)"**

**Request:**
```
GET http://localhost:8080/ms-resultados/api/resultados/departamento/La Paz
```

**Código fuente:**
```java
// En ResultadosRepository.java
List<ResultadoMesa> findByDepartamentoIgnoreCase(String departamento);
```

#### JPQL Query
**En Postman:**
1. Petición: **"Buscar por Mínimo Inscritos (USER)"**

**Request:**
```
GET http://localhost:8080/ms-resultados/api/resultados/inscritos-minimo/300
```

**Código fuente:**
```java
// En ResultadosRepository.java
@Query("SELECT r FROM ResultadoMesa r WHERE r.inscritos >= :min ORDER BY r.inscritos DESC")
List<ResultadoMesa> buscarPorMinimoInscritos(@Param("min") Long min);
```

#### Native Query
**En Postman:**
1. Petición: **"Buscar por Votos Válidos Mínimos (USER)"**

**Request:**
```
GET http://localhost:8080/ms-resultados/api/resultados/votos-validos-minimo/200
```

**Código fuente:**
```java
// En ResultadosRepository.java
@Query(value = "SELECT * FROM resultado_mesa WHERE votos_validos >= :min", nativeQuery = true)
List<ResultadoMesa> buscarPorVotosValidosMinimos(@Param("min") Long min);
```

### 📁 Archivos a mostrar:
- `src/main/java/.../repository/ResultadosRepository.java`
- `src/main/java/.../service/ResultadosService.java`
- `src/main/resources/application.properties` (líneas de BD)

---

## 3. CRITERIO 2: EUREKA SERVER

### ✅ Qué demostrar:
- Eureka Server levantado
- Microservicio registrado en Eureka
- Descubrimiento dinámico funcionando

### 🎬 DEMOSTRACIÓN EN VIVO

#### A. Acceder al Dashboard de Eureka
**En el navegador:**
```
http://localhost:8761
```

**Qué mostrar:**
- Panel de Eureka funcionando
- En "Instances currently registered with Eureka" debe aparecer:
  - `RESULTADOS-ESTADISTICAS` (1 instancia)
  - `API-GATEWAY`
  - `VOTACIONES-SERVICE`
  - `USUARIOS-SERVICE`

#### B. Verificar registro del microservicio
**En el dashboard de Eureka:**
- Busca `RESULTADOS-ESTADISTICAS`
- Debe mostrar: Status `UP`, 1 instancia

#### C. Verificar logs de registro
```bash
docker logs ms-resultados | grep "Eureka"
```

**Resultado esperado:**
```
DiscoveryClient_RESULTADOS-ESTADISTICAS - registration status: 204
```

#### D. Demostrar descubrimiento dinámico
**Explicar:** El Gateway encuentra al microservicio por nombre lógico, no por IP fija.

**Mostrar en código:**
```yaml
# En api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: resultados-service
          uri: lb://RESULTADOS-ESTADISTICAS  # ← Nombre lógico, no IP
          predicates:
            - Path=/ms-resultados/**
```

### 📁 Archivos a mostrar:
- `src/main/resources/application.properties` (línea de Eureka)
- `src/main/java/.../ResultadosEstadisticasApplication.java` (con `@EnableDiscoveryClient`)

---

## 4. CRITERIO 3: EDGE SERVER (GATEWAY)

### ✅ Qué demostrar:
- Gateway enruta peticiones correctamente
- Uso de predicados y filtros
- Swagger accesible a través del Gateway

### 🎬 DEMOSTRACIÓN EN VIVO

#### A. Probar enrutamiento del Gateway
**En Postman:**
1. Petición: **"Listar Resultados (ADMIN)"**
2. URL: `http://localhost:8080/ms-resultados/api/resultados`

**Explicar:**
- Petición llega al Gateway (puerto 8080)
- Gateway usa predicado `Path=/ms-resultados/**`
- Gateway redirige a `RESULTADOS-ESTADISTICAS` (descubierto por Eureka)
- Microservicio responde (puerto 8083)

#### B. Comparar acceso directo vs Gateway

**Acceso directo (NO usar en producción):**
```
http://localhost:8083/api/resultados
```

**Acceso por Gateway (CORRECTO):**
```
http://localhost:8080/ms-resultados/api/resultados
```

**Explicar:** Siempre se debe acceder por el Gateway.

#### C. Mostrar Swagger a través del Gateway
**En el navegador:**
```
http://localhost:8080/ms-resultados/swagger-ui.html
```

**Resultado esperado:** Documentación Swagger del microservicio

#### D. Mostrar configuración del Gateway
**Archivo a mostrar:** `api-gateway/src/main/resources/application.yml`

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: resultados-service
          uri: lb://RESULTADOS-ESTADISTICAS
          predicates:
            - Path=/ms-resultados/**
          filters:
            - StripPrefix=1
```

**Explicar:**
- **Predicado `Path`:** Si la URL empieza con `/ms-resultados/**`, usa esta ruta
- **Filtro `StripPrefix=1`:** Quita `/ms-resultados` antes de enviar al microservicio
- **`lb://`:** Load balancer, usa Eureka para encontrar el servicio

---

## 5. CRITERIO 4: DOCKER

### ✅ Qué demostrar:
- Dockerfile funcional
- Docker Compose levanta todo correctamente
- Dependencias y redes configuradas
- Sistema saludable

### 🎬 DEMOSTRACIÓN EN VIVO

#### A. Mostrar Dockerfile
**Archivo:** `resultados_estadisticas/Dockerfile`

```dockerfile
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY resultados_estadisticas/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### B. Verificar imagen construida
```bash
docker images | grep resultados
```

**Resultado esperado:** Debe aparecer la imagen `boliviandigitalizationvotes-resultados-estadisticas`

#### C. Mostrar Docker Compose
**Archivo:** `docker-compose.yml` (líneas 192-211)

```yaml
resultados-estadisticas:
  build:
    context: .
    dockerfile: resultados_estadisticas/Dockerfile
  container_name: ms-resultados
  ports:
    - "8083:8083"
  environment:
    - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db-resultados:5432/resultados_db
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
    - SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI=http://host.docker.internal:8180/auth/realms/votaciones-realm/protocol/openid-connect/certs
  depends_on:
    postgres-db-resultados:
      condition: service_healthy
    eureka-server:
      condition: service_started
    keycloak:
      condition: service_started
```

#### D. Verificar contenedores corriendo
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**Resultado esperado:** Todos los contenedores con status `Up`

#### E. Verificar salud del sistema
```bash
# Salud del microservicio
curl http://localhost:8080/ms-resultados/actuator/health

# Logs sin errores
docker logs ms-resultados --tail 50
```

**Resultado esperado:** `{"status":"UP"}`

#### F. Verificar comunicación entre servicios
**En Postman:**
1. Ejecuta cualquier petición GET
2. Debe funcionar correctamente

**Explicar:** Esto demuestra que:
- Gateway se comunica con ms-resultados
- ms-resultados se comunica con PostgreSQL
- ms-resultados se comunica con Keycloak
- Todo a través de la red de Docker

---

## 6. CRITERIO 5: KEYCLOAK

### ✅ Qué demostrar:
- Realm configurado con roles y usuarios
- Microservicio integrado con Keycloak
- Endpoints protegidos con JWT
- Control de acceso por roles

### 🎬 DEMOSTRACIÓN EN VIVO

#### A. Mostrar configuración de Keycloak

**Archivo:** `keycloak/votaciones-realm.json`

**Mostrar:**
- Realm: `votaciones-realm`
- Roles: `ADMIN`, `USER`
- Usuarios:
  - `admin` / `admin123` → Rol ADMIN
  - `user` / `user123` → Rol USER

#### B. Acceder al panel de Keycloak (opcional)
**En el navegador:**
```
http://localhost:8180/auth
```
Login: `admin` / `admin`

#### C. Obtener token JWT

**En Postman:**
1. Carpeta: **"1. Autenticación Keycloak"**
2. Petición: **"Obtener Token - ADMIN"**
3. Ejecuta

**Request:**
```
POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

Body:
client_id=votaciones-client
username=admin
password=admin123
grant_type=password
```

**Resultado esperado:** `200 OK` con `access_token`

**Mostrar el token en jwt.io:**
1. Copia el `access_token`
2. Ve a https://jwt.io/
3. Pega el token
4. Muestra el payload con `realm_access.roles: ["ADMIN"]`

#### D. Probar endpoint protegido CON token

**En Postman:**
1. Petición: **"Listar Resultados (ADMIN)"**
2. Verifica que el header `Authorization: Bearer TOKEN` esté presente
3. Ejecuta

**Resultado esperado:** `200 OK` con datos

#### E. Probar endpoint protegido SIN token

**En Postman:**
1. Carpeta: **"4. Pruebas de Seguridad"**
2. Petición: **"❌ Sin Token (401)"**
3. Ejecuta

**Resultado esperado:** `401 Unauthorized`

**Explicar:** Spring Security detecta que no hay token y rechaza la petición.

#### F. Probar control de acceso por roles

**En Postman:**
1. Primero obtén token de USER: **"Obtener Token - USER"**
2. Petición: **"❌ USER intenta Crear (403)"**
3. Ejecuta

**Resultado esperado:** `403 Forbidden`

**Explicar:**
- El token es válido ✅
- Pero el usuario tiene rol USER
- El endpoint requiere rol ADMIN (`@PreAuthorize("hasRole('ADMIN')")`)
- Spring Security rechaza la petición

#### G. Mostrar código de seguridad

**Archivo 1:** `src/main/java/.../config/SecurityConfig.java`

**Mostrar:**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public JwtDecoder jwtDecoder() {
        // Valida tokens JWT con Keycloak
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        // Configura qué endpoints requieren autenticación
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Extrae roles del token y los convierte a authorities
    }
}
```

**Archivo 2:** `src/main/java/.../controller/ResultadosController.java`

**Mostrar anotaciones:**
```java
@PreAuthorize("hasRole('ADMIN')")  // Solo ADMIN
@PostMapping
public ResponseEntity<ResultadoMesa> crear(...) { ... }

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")  // USER o ADMIN
@GetMapping
public ResponseEntity<List<ResultadoMesa>> listar() { ... }
```

#### H. Mostrar integración en application.properties

**Archivo:** `src/main/resources/application.properties`

```properties
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/certs
```

**Explicar:** Esta URL es donde Spring Security descarga las claves públicas de Keycloak para validar tokens.

---

## 📊 RESUMEN DE EVIDENCIAS POR CRITERIO

### Criterio 1: Persistencia
- ✅ Logs de conexión a BD
- ✅ CRUD funcionando en Postman (POST, GET, PUT, DELETE)
- ✅ Código de Repository con 3 tipos de consultas
- ✅ Datos reales desde PostgreSQL

### Criterio 2: Eureka
- ✅ Dashboard de Eureka con microservicio registrado
- ✅ Logs de registro exitoso
- ✅ Código con `@EnableDiscoveryClient`
- ✅ Configuración en application.properties

### Criterio 3: Gateway
- ✅ Peticiones funcionando a través del Gateway
- ✅ Swagger accesible por Gateway
- ✅ Configuración de rutas, predicados y filtros
- ✅ Uso de nombre lógico (no IP fija)

### Criterio 4: Docker
- ✅ Dockerfile funcional
- ✅ Docker Compose levantando todo
- ✅ `docker ps` mostrando contenedores saludables
- ✅ Logs sin errores
- ✅ Comunicación entre servicios

### Criterio 5: Keycloak
- ✅ Realm configurado (votaciones-realm.json)
- ✅ Token obtenido exitosamente
- ✅ Endpoint con token → 200 OK
- ✅ Endpoint sin token → 401 Unauthorized
- ✅ USER intenta crear → 403 Forbidden
- ✅ Código con SecurityConfig y @PreAuthorize

---

## 🎯 ORDEN RECOMENDADO DE DEMOSTRACIÓN

1. **Inicializar sistema** (docker-compose up -d)
2. **Criterio 4: Docker** (mostrar contenedores corriendo)
3. **Criterio 2: Eureka** (dashboard con servicios registrados)
4. **Criterio 3: Gateway** (Swagger accesible)
5. **Criterio 5: Keycloak** (obtener token, probar seguridad)
6. **Criterio 1: Persistencia** (CRUD completo con datos reales)

---

## 🛠️ COMANDOS ÚTILES DURANTE LA DEMO

```bash
# Ver contenedores
docker ps

# Ver logs de un servicio
docker logs ms-resultados
docker logs keycloak
docker logs eureka-server

# Reiniciar un servicio
docker-compose restart ms-resultados

# Parar todo
docker-compose down

# Levantar todo de nuevo
docker-compose up -d

# Ver salud del microservicio
curl http://localhost:8080/ms-resultados/actuator/health
```

---

## 📁 ARCHIVOS CLAVE A TENER ABIERTOS

1. `docker-compose.yml` (líneas 192-211)
2. `resultados_estadisticas/Dockerfile`
3. `resultados_estadisticas/src/main/resources/application.properties`
4. `resultados_estadisticas/src/main/java/.../config/SecurityConfig.java`
5. `resultados_estadisticas/src/main/java/.../controller/ResultadosController.java`
6. `resultados_estadisticas/src/main/java/.../repository/ResultadosRepository.java`
7. `keycloak/votaciones-realm.json`

---

## ✅ CHECKLIST FINAL ANTES DE LA DEMO

- [ ] Docker Desktop corriendo
- [ ] `docker-compose up -d` ejecutado
- [ ] Todos los contenedores con status `Up`
- [ ] Postman abierto con colección importada
- [ ] Token de ADMIN obtenido y guardado
- [ ] Token de USER obtenido y guardado
- [ ] Navegador con tabs abiertos:
  - http://localhost:8761 (Eureka)
  - http://localhost:8080/ms-resultados/swagger-ui.html (Swagger)
- [ ] IDE con archivos clave abiertos
- [ ] Esta guía abierta para referencia

---

¡Listo para la evaluación! 🚀
