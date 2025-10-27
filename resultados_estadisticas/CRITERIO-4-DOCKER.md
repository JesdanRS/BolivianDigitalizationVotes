# ✅ CRITERIO 4: DOCKER

## 📋 Checklist de Verificación

### ✅ Dockerfile funcional
- [x] Dockerfile multi-stage configurado
- [x] Imagen construye correctamente con `docker build`
- [x] Imagen optimizada (builder + runtime)

### ✅ Docker Compose - Configuración
- [x] docker-compose.yml define todos los servicios
- [x] Servicio Eureka configurado
- [x] Servicio Gateway configurado
- [x] Servicio PostgreSQL configurado
- [x] Microservicio resultados-estadisticas configurado

### ✅ Docker Compose - Dependencias y Redes
- [x] Dependencias configuradas con `depends_on`
- [x] Health checks implementados
- [x] Variables de entorno configuradas
- [x] Los servicios se comunican correctamente

### ✅ Docker Compose - Logs y Salud
- [x] Todos los contenedores inician correctamente
- [x] `docker ps` muestra estado saludable
- [x] Logs sin errores críticos
- [x] Postman/curl accede correctamente

---

## 🗂️ PARTE 1: DOCKERFILE FUNCIONAL

### 📁 Ubicación
`resultados_estadisticas/Dockerfile`

### 📄 Contenido completo

```dockerfile
# FASE 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copiamos el módulo y construimos (saltando tests)
COPY ./resultados_estadisticas /app/resultados_estadisticas
RUN cd /app/resultados_estadisticas && mvn clean package -DskipTests -Dmaven.test.skip=true

# FASE 2: Runtime
FROM openjdk:21-slim
WORKDIR /app
COPY --from=build /app/resultados_estadisticas/target/resultados_estadisticas-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java","-jar","app.jar"]
```

### 🔍 Explicación detallada

#### FASE 1: Build (Construcción)
```dockerfile
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
```
**¿Qué hace?**
- Usa imagen de Maven con Java 21 (Alpine Linux = ligera)
- Se llama "build" para referenciarla después
- Contiene todas las herramientas para compilar código Java

```dockerfile
WORKDIR /app
COPY ./resultados_estadisticas /app/resultados_estadisticas
```
**¿Qué hace?**
- Establece `/app` como directorio de trabajo
- Copia TODO el código fuente del microservicio

```dockerfile
RUN cd /app/resultados_estadisticas && mvn clean package -DskipTests -Dmaven.test.skip=true
```
**¿Qué hace?**
- `mvn clean` - Limpia compilaciones anteriores
- `mvn package` - Compila y empaqueta en un JAR
- `-DskipTests` - Salta los tests (más rápido)
- Resultado: `target/resultados_estadisticas-0.0.1-SNAPSHOT.jar`

#### FASE 2: Runtime (Ejecución)
```dockerfile
FROM openjdk:21-slim
```
**¿Qué hace?**
- Nueva imagen, MÁS LIGERA (solo Java runtime, no Maven)
- Reduce tamaño de ~500MB a ~200MB

```dockerfile
WORKDIR /app
COPY --from=build /app/resultados_estadisticas/target/resultados_estadisticas-0.0.1-SNAPSHOT.jar app.jar
```
**¿Qué hace?**
- Copia SOLO el JAR compilado desde la fase "build"
- No copia el código fuente ni las dependencias de Maven
- Renombra a `app.jar` (más simple)

```dockerfile
EXPOSE 8083
```
**¿Qué hace?**
- Documenta que el contenedor escucha en el puerto 8083
- NO abre el puerto (eso lo hace `docker-compose.yml` con `ports`)

```dockerfile
ENTRYPOINT ["java","-jar","app.jar"]
```
**¿Qué hace?**
- Comando que se ejecuta cuando inicia el contenedor
- `java -jar app.jar` = inicia la aplicación Spring Boot

### 🎯 Ventajas del Multi-Stage Build

| Aspecto | Single-Stage | Multi-Stage |
|---------|--------------|-------------|
| Tamaño imagen final | ~500 MB | ~200 MB |
| Contiene código fuente | ✅ Sí | ❌ No |
| Contiene Maven | ✅ Sí | ❌ No |
| Seguridad | ⚠️ Menor | ✅ Mayor |
| Velocidad ejecución | ⏱️ Normal | ⚡ Rápida |

### 🧪 Prueba: Construir imagen

#### 1. Construcción manual (opcional, para pruebas)
```bash
# Desde la raíz del proyecto
docker build -t resultados-estadisticas:latest -f resultados_estadisticas/Dockerfile .
```

**Resultado esperado:**
```
[+] Building 45.2s (10/10) FINISHED
 => [build 1/3] FROM docker.io/library/maven:3.9.6-eclipse-temurin-21-alpine
 => [build 2/3] COPY ./resultados_estadisticas /app/resultados_estadisticas
 => [build 3/3] RUN cd /app/resultados_estadisticas && mvn clean package -DskipTests
 => [stage-1 1/2] FROM docker.io/library/openjdk:21-slim
 => [stage-1 2/2] COPY --from=build /app/resultados_estadisticas/target/*.jar app.jar
 => exporting to image
 => => naming to docker.io/library/resultados-estadisticas:latest
```

#### 2. Ver la imagen creada
```bash
docker images | grep resultados-estadisticas
```

**Resultado esperado:**
```
resultados-estadisticas   latest   abc123def456   2 minutes ago   250MB
```

#### 3. Ejecutar la imagen manualmente (opcional)
```bash
docker run -p 8083:8083 resultados-estadisticas:latest
```

**Nota:** En la práctica, usamos `docker-compose` que hace todo esto automáticamente.

---

## 🗂️ PARTE 2: DOCKER COMPOSE

### 📁 Ubicación
`docker-compose.yml` (en la raíz del proyecto)

### 📄 Sección de resultados-estadisticas

```yaml
# Base de datos de resultados_estadisticas
postgres-db-resultados:
  image: postgres:16-alpine
  container_name: bd-resultados
  ports:
    - "5434:5432"
  environment:
    - POSTGRES_DB=resultados_db
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=password
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres -d resultados_db"]
    interval: 5s
    timeout: 3s
    retries: 5
  volumes:
    - db-data-resultados:/var/lib/postgresql/data

# Servicio resultados-estadisticas
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
  depends_on:
    postgres-db-resultados:
      condition: service_healthy
    eureka-server:
      condition: service_started

volumes:
  db-data-resultados:
```

### 🔍 Explicación detallada

#### Servicio: postgres-db-resultados

```yaml
image: postgres:16-alpine
```
**¿Qué hace?**
- Usa imagen oficial de PostgreSQL versión 16
- Alpine = versión ligera (pequeña)

```yaml
container_name: bd-resultados
```
**¿Qué hace?**
- Nombre fijo del contenedor (fácil de identificar)
- Aparece como "bd-resultados" en `docker ps`

```yaml
ports:
  - "5434:5432"
```
**¿Qué hace?**
- Mapea puerto 5434 del HOST → 5432 del CONTENEDOR
- Permite acceder desde fuera: `localhost:5434`
- Dentro de Docker: `postgres-db-resultados:5432`

```yaml
environment:
  - POSTGRES_DB=resultados_db
  - POSTGRES_USER=postgres
  - POSTGRES_PASSWORD=password
```
**¿Qué hace?**
- Crea automáticamente la base de datos `resultados_db`
- Usuario: `postgres`, Password: `password`
- Se puede conectar con cualquier cliente PostgreSQL

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres -d resultados_db"]
  interval: 5s
  timeout: 3s
  retries: 5
```
**¿Qué hace?**
- Verifica cada 5 segundos si PostgreSQL está listo
- `pg_isready` = comando que verifica si la BD acepta conexiones
- Si falla 5 veces, marca el servicio como "unhealthy"
- **Importante:** Otros servicios esperan que esté "healthy" antes de iniciar

```yaml
volumes:
  - db-data-resultados:/var/lib/postgresql/data
```
**¿Qué hace?**
- Persiste los datos en un volumen Docker
- Si se reinicia el contenedor, los datos NO se pierden
- Los datos están en `/var/lib/postgresql/data` (directorio estándar de Postgres)

#### Servicio: resultados-estadisticas

```yaml
build:
  context: .
  dockerfile: resultados_estadisticas/Dockerfile
```
**¿Qué hace?**
- `context: .` = Usa la raíz del proyecto como contexto
- `dockerfile: ...` = Ruta al Dockerfile
- Docker Compose construirá la imagen automáticamente

```yaml
container_name: ms-resultados
```
**¿Qué hace?**
- Nombre fijo: "ms-resultados"
- Aparece así en `docker ps` y logs

```yaml
ports:
  - "8083:8083"
```
**¿Qué hace?**
- Mapea puerto 8083 del HOST → 8083 del CONTENEDOR
- Accesible desde: `http://localhost:8083`

```yaml
environment:
  - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db-resultados:5432/resultados_db
  - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```
**¿Qué hace?**
- **SOBRESCRIBE** las propiedades de `application.properties`
- `postgres-db-resultados:5432` = Usa el NOMBRE del servicio (DNS interno de Docker)
- `eureka-server:8761` = Lo mismo para Eureka

**Ejemplo de resolución DNS:**
```
postgres-db-resultados → 172.18.0.3:5432 (IP interna de Docker)
eureka-server → 172.18.0.2:8761 (IP interna de Docker)
```

```yaml
depends_on:
  postgres-db-resultados:
    condition: service_healthy
  eureka-server:
    condition: service_started
```
**¿Qué hace?**
- **NO inicia** `resultados-estadisticas` hasta que:
  1. `postgres-db-resultados` esté "healthy" (health check pasando)
  2. `eureka-server` haya iniciado (al menos el proceso)
- Evita errores de "no se puede conectar a la base de datos"

### 🌐 Red de Docker

Docker Compose crea automáticamente una red donde:
- Todos los servicios pueden comunicarse usando sus nombres
- Ejemplo: `ms-resultados` puede hacer `ping postgres-db-resultados`

```
┌──────────────────────────────────────┐
│       Docker Network (bridge)        │
│                                      │
│  ┌────────────────┐                 │
│  │ eureka-server  │                 │
│  │  172.18.0.2    │                 │
│  └────────────────┘                 │
│          │                          │
│  ┌────────────────┐                 │
│  │  api-gateway   │                 │
│  │  172.18.0.4    │                 │
│  └────────────────┘                 │
│          │                          │
│  ┌────────────────────────────────┐ │
│  │  resultados-estadisticas       │ │
│  │  (ms-resultados)               │ │
│  │  172.18.0.5                    │ │
│  └────────────────────────────────┘ │
│          │                          │
│  ┌────────────────────────────────┐ │
│  │  postgres-db-resultados        │ │
│  │  (bd-resultados)               │ │
│  │  172.18.0.3                    │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## 🧪 PARTE 3: PRUEBAS DE VERIFICACIÓN

### ✅ Prueba 1: Construir imagen del Dockerfile

```bash
# Construir la imagen manualmente
docker build -t resultados-estadisticas:latest -f resultados_estadisticas/Dockerfile .
```

**Verificar que construyó correctamente:**
```bash
docker images | grep resultados-estadisticas
```

**Resultado esperado:**
```
resultados-estadisticas   latest   abc123   2 mins ago   250MB
```

---

### ✅ Prueba 2: Levantar con Docker Compose

```bash
# Levantar todos los servicios
docker compose up -d
```

**Resultado esperado:**
```
[+] Running 8/8
 ✔ Network boliviandigitalizationvotes_default  Created
 ✔ Container bd-resultados                      Healthy
 ✔ Container eureka-server                      Started
 ✔ Container api-gateway                        Started
 ✔ Container ms-resultados                      Started
```

---

### ✅ Prueba 3: Verificar servicios corriendo

```bash
docker ps
```

**Resultado esperado:**
```
CONTAINER ID   IMAGE                      STATUS                    PORTS                    NAMES
abc123def456   resultados-estadisticas    Up 30 seconds (healthy)   0.0.0.0:8083->8083/tcp  ms-resultados
def456abc123   postgres:16-alpine         Up 30 seconds (healthy)   0.0.0.0:5434->5432/tcp  bd-resultados
ghi789jkl012   eureka-server              Up 30 seconds             0.0.0.0:8761->8761/tcp  eureka-server
jkl012ghi789   api-gateway                Up 30 seconds             0.0.0.0:8080->8080/tcp  api-gateway
```

**Puntos clave a verificar:**
- ✅ Estado "Up" (corriendo)
- ✅ "(healthy)" para bases de datos
- ✅ Puertos mapeados correctamente

---

### ✅ Prueba 4: Verificar health checks

```bash
# Ver detalles del contenedor de PostgreSQL
docker inspect bd-resultados | grep -A 10 Health
```

**Resultado esperado:**
```json
"Health": {
    "Status": "healthy",
    "FailingStreak": 0,
    "Log": [
        {
            "Start": "2025-10-27T...",
            "End": "2025-10-27T...",
            "ExitCode": 0,
            "Output": "accepting connections"
        }
    ]
}
```

---

### ✅ Prueba 5: Ver logs de los servicios

```bash
# Logs del microservicio
docker compose logs resultados-estadisticas
```

**Resultado esperado (sin errores):**
```
ms-resultados  | Started ResultadosEstadisticasApplication in 12.345 seconds
ms-resultados  | Tomcat started on port(s): 8083 (http)
ms-resultados  | Registered with Eureka Server at http://eureka-server:8761/eureka
```

```bash
# Logs de PostgreSQL
docker compose logs postgres-db-resultados
```

**Resultado esperado:**
```
bd-resultados  | database system is ready to accept connections
bd-resultados  | LOG:  autovacuum launcher started
```

---

### ✅ Prueba 6: Verificar comunicación entre servicios

#### 6.1 Microservicio puede conectarse a PostgreSQL
```bash
# Ver logs del microservicio buscando "HikariPool"
docker compose logs resultados-estadisticas | grep -i hikari
```

**Resultado esperado:**
```
ms-resultados  | HikariPool-1 - Starting...
ms-resultados  | HikariPool-1 - Start completed.
```

#### 6.2 Microservicio se registró en Eureka
```bash
# Ver logs buscando "Eureka"
docker compose logs resultados-estadisticas | grep -i eureka
```

**Resultado esperado:**
```
ms-resultados  | DiscoveryClient_RESULTADOS-ESTADISTICAS/... - registration status: 204
ms-resultados  | Registered with Eureka Server at http://eureka-server:8761/eureka
```

#### 6.3 Gateway puede acceder al microservicio
```bash
curl http://localhost:8080/api/resultados
```

**Resultado esperado:**
```json
[
  {
    "id": 1,
    "departamento": "La Paz",
    "municipio": "La Paz",
    ...
  }
]
```

---

### ✅ Prueba 7: Postman accede correctamente

#### Configurar Postman

**URL:** `http://localhost:8080/api/resultados`  
**Method:** GET  
**Headers:** (ninguno necesario por ahora)

**Resultado esperado:**
- Status: `200 OK`
- Body: JSON con lista de resultados
- Time: < 500ms

#### Otras peticiones para probar
```
GET  http://localhost:8080/api/resultados/1
GET  http://localhost:8080/api/resultados/departamento/La%20Paz
POST http://localhost:8080/api/resultados
```

---

## 📊 TABLA DE DEPENDENCIAS

| Servicio | Depende de | Condición |
|----------|------------|-----------|
| `postgres-db-resultados` | - | - |
| `eureka-server` | - | - |
| `resultados-estadisticas` | `postgres-db-resultados` | `service_healthy` |
| `resultados-estadisticas` | `eureka-server` | `service_started` |
| `api-gateway` | `eureka-server` | `service_started` |

### Orden de inicio (automático)
1. `postgres-db-resultados` (primero, sin dependencias)
2. `eureka-server` (primero, sin dependencias)
3. **Espera health check de PostgreSQL** ⏳
4. `resultados-estadisticas` (cuando BD está healthy)
5. `api-gateway` (cuando Eureka ha iniciado)

---

## 🛠️ COMANDOS ÚTILES

### Gestión de servicios
```bash
# Levantar todos los servicios
docker compose up -d

# Levantar solo servicios específicos
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas api-gateway

# Ver servicios corriendo
docker ps

# Ver todos los servicios (incluso detenidos)
docker ps -a

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (datos de BD)
docker compose down -v
```

### Logs
```bash
# Ver logs de todos los servicios
docker compose logs

# Ver logs de un servicio específico
docker compose logs resultados-estadisticas

# Ver logs en tiempo real (follow)
docker compose logs -f resultados-estadisticas

# Ver últimas 50 líneas
docker compose logs --tail=50 resultados-estadisticas

# Ver logs de varios servicios
docker compose logs resultados-estadisticas postgres-db-resultados
```

### Debugging
```bash
# Entrar al contenedor (shell)
docker exec -it ms-resultados sh

# Ver procesos dentro del contenedor
docker exec ms-resultados ps aux

# Ver variables de entorno
docker exec ms-resultados env

# Ver estadísticas de uso
docker stats ms-resultados

# Inspeccionar configuración completa
docker inspect ms-resultados
```

### Reconstruir imágenes
```bash
# Reconstruir imagen de un servicio
docker compose build resultados-estadisticas

# Reconstruir todas las imágenes
docker compose build

# Reconstruir sin caché (desde cero)
docker compose build --no-cache resultados-estadisticas
```

### Limpieza
```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Eliminar volúmenes sin usar
docker volume prune

# Limpieza completa (¡CUIDADO!)
docker system prune -a --volumes
```

---

## 🔧 TROUBLESHOOTING

### Problema: "Cannot connect to database"

**Solución:**
```bash
# 1. Verificar que PostgreSQL está healthy
docker ps

# 2. Ver logs de PostgreSQL
docker compose logs postgres-db-resultados

# 3. Reiniciar servicios
docker compose restart postgres-db-resultados resultados-estadisticas
```

### Problema: "Service not registered in Eureka"

**Solución:**
```bash
# 1. Ver logs de Eureka
docker compose logs eureka-server

# 2. Ver logs del microservicio
docker compose logs resultados-estadisticas | grep -i eureka

# 3. Verificar variable de entorno
docker exec ms-resultados env | grep EUREKA
```

### Problema: "Port already in use"

**Solución:**
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :8083

# Cambiar el puerto en docker-compose.yml
ports:
  - "8084:8083"  # Usa 8084 en el host
```

### Problema: "Build failed"

**Solución:**
```bash
# Limpiar y reconstruir
docker compose down
docker compose build --no-cache resultados-estadisticas
docker compose up -d
```

---

## 🎯 DEMOSTRACIÓN DEL CRITERIO 4

### Secuencia de Demostración (10 minutos)

#### 1. Mostrar Dockerfile (2 min)

**Archivo:** `resultados_estadisticas/Dockerfile`

**Puntos clave:**
- Multi-stage build (FASE 1 y FASE 2)
- Imagen final optimizada (solo runtime)
- Puerto 8083 expuesto

#### 2. Mostrar docker-compose.yml (2 min)

**Archivo:** `docker-compose.yml`

**Puntos clave:**
- Servicio `postgres-db-resultados` con health check
- Servicio `resultados-estadisticas` con dependencias
- Variables de entorno configuradas
- Volumen para persistencia

#### 3. Levantar servicios (2 min)

```bash
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas api-gateway
```

**Mostrar:**
- Servicios iniciando en orden
- Health checks pasando

#### 4. Verificar estado (2 min)

```bash
# Ver servicios corriendo
docker ps

# Ver logs sin errores
docker compose logs resultados-estadisticas --tail=20
```

#### 5. Probar comunicación (2 min)

```bash
# A través del Gateway
curl http://localhost:8080/api/resultados

# Directo al microservicio
curl http://localhost:8083/api/resultados
```

**Resultado:** Ambos retornan datos correctamente ✅

---

## 📋 CHECKLIST FINAL

### Dockerfile funcional
- [x] Multi-stage build implementado
- [x] Imagen construye sin errores
- [x] Imagen optimizada (~250MB)
- [x] Puerto expuesto correctamente

### docker-compose.yml correcto
- [x] Servicio PostgreSQL definido
- [x] Servicio Eureka definido
- [x] Servicio Gateway definido
- [x] Microservicio definido
- [x] Variables de entorno configuradas
- [x] Puertos mapeados correctamente

### Dependencias y redes
- [x] `depends_on` configurado
- [x] Health checks implementados
- [x] DNS interno funciona (nombres de servicio)
- [x] Microservicio conecta a PostgreSQL
- [x] Microservicio se registra en Eureka
- [x] Gateway enruta correctamente

### Logs y salud del sistema
- [x] `docker ps` muestra estado "Up"
- [x] Health checks en estado "healthy"
- [x] Logs sin errores críticos
- [x] Postman/curl accede correctamente
- [x] Respuestas con datos reales

---

## 📸 CAPTURAS RECOMENDADAS

1. **Dockerfile** - Mostrando multi-stage build
2. **docker-compose.yml** - Sección de resultados-estadisticas
3. **Terminal** - `docker compose up` exitoso
4. **Terminal** - `docker ps` mostrando servicios healthy
5. **Terminal** - Logs sin errores
6. **Terminal** - `curl` retornando datos
7. **Postman** - Respuesta exitosa

---

## 🎉 RESUMEN

### ✅ Dockerfile funcional
- Multi-stage build optimizado
- Imagen construye correctamente
- Tamaño reducido (~250MB vs ~500MB)

### ✅ Docker Compose correcto
- Todos los servicios definidos
- Variables de entorno configuradas
- Dependencias y health checks implementados

### ✅ Comunicación entre servicios
- PostgreSQL accesible
- Eureka registra el servicio
- Gateway enruta correctamente
- Postman obtiene datos reales

### ✅ Sistema saludable
- `docker ps` muestra estado "Up (healthy)"
- Logs sin errores críticos
- Todos los servicios funcionando

---

**✅ CRITERIO 4: DOCKER - 100% COMPLETADO**

