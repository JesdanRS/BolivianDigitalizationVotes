# 🐳 COMANDOS DE PRUEBA - CRITERIO 4: DOCKER

## 🚀 PRUEBAS DOCKERFILE

### 1. Construir imagen manualmente
```bash
docker build -t resultados-estadisticas:test -f resultados_estadisticas/Dockerfile .
```

**Resultado esperado:**
```
[+] Building 45.2s (10/10) FINISHED
 => [build 3/3] RUN cd /app/resultados_estadisticas && mvn clean package
 => [stage-1 2/2] COPY --from=build /app/resultados_estadisticas/target/*.jar app.jar
 => => naming to docker.io/library/resultados-estadisticas:test
```

### 2. Ver la imagen creada
```bash
docker images | grep resultados-estadisticas
```

**Resultado esperado:**
```
resultados-estadisticas   test     abc123   2 mins ago   250MB
```

### 3. Ver detalles de la imagen
```bash
docker inspect resultados-estadisticas:test | grep -A 5 ExposedPorts
```

**Resultado esperado:**
```json
"ExposedPorts": {
    "8083/tcp": {}
}
```

### 4. Ver las capas de la imagen
```bash
docker history resultados-estadisticas:test
```

**Resultado esperado:** Dos grandes bloques (build + runtime)

### 5. Ejecutar la imagen manualmente (opcional)
```bash
docker run -d -p 8083:8083 --name test-resultados resultados-estadisticas:test
```

### 6. Ver logs del contenedor manual
```bash
docker logs test-resultados
```

### 7. Limpiar contenedor de prueba
```bash
docker stop test-resultados
docker rm test-resultados
docker rmi resultados-estadisticas:test
```

---

## 🐳 PRUEBAS DOCKER COMPOSE

### INICIO Y PARADA

#### 1. Levantar todos los servicios
```bash
docker compose up -d
```

**Resultado esperado:**
```
[+] Running 8/8
 ✔ Network boliviandigitalizationvotes_default  Created
 ✔ Container bd-resultados                      Healthy
 ✔ Container eureka-server                      Started
 ✔ Container ms-resultados                      Started
 ✔ Container api-gateway                        Started
```

#### 2. Levantar solo servicios específicos
```bash
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas api-gateway
```

#### 3. Ver estado de los servicios
```bash
docker compose ps
```

**Resultado esperado:**
```
NAME             STATUS                    PORTS
bd-resultados    Up 30 seconds (healthy)   0.0.0.0:5434->5432/tcp
eureka-server    Up 30 seconds             0.0.0.0:8761->8761/tcp
ms-resultados    Up 20 seconds             0.0.0.0:8083->8083/tcp
api-gateway      Up 20 seconds             0.0.0.0:8080->8080/tcp
```

#### 4. Detener servicios
```bash
docker compose stop
```

#### 5. Iniciar servicios detenidos
```bash
docker compose start
```

#### 6. Reiniciar servicios
```bash
docker compose restart resultados-estadisticas
```

#### 7. Detener y eliminar todo
```bash
docker compose down
```

#### 8. Detener y eliminar incluyendo volúmenes
```bash
docker compose down -v
```

---

### VERIFICACIÓN DE ESTADO

#### 1. Ver todos los contenedores (corriendo y detenidos)
```bash
docker ps -a
```

#### 2. Ver solo contenedores relacionados al proyecto
```bash
docker ps | grep -E "(eureka|gateway|resultados|postgres)"
```

#### 3. Ver estadísticas en tiempo real
```bash
docker stats ms-resultados
```

**Resultado esperado:**
```
CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT     NET I/O
abc123         ms-resultados  0.50%     250MiB / 2GiB        1.2kB / 850B
```

#### 4. Ver salud de los servicios
```bash
docker inspect ms-resultados | grep -A 5 State
```

**Resultado esperado:**
```json
"State": {
    "Status": "running",
    "Running": true,
    "Paused": false,
    "Restarting": false,
    "OOMKilled": false,
    "Dead": false
}
```

#### 5. Ver health check de PostgreSQL
```bash
docker inspect bd-resultados | grep -A 10 Health
```

**Resultado esperado:**
```json
"Health": {
    "Status": "healthy",
    "FailingStreak": 0
}
```

---

### LOGS

#### 1. Ver logs de todos los servicios
```bash
docker compose logs
```

#### 2. Ver logs de un servicio específico
```bash
docker compose logs resultados-estadisticas
```

#### 3. Ver logs en tiempo real (follow)
```bash
docker compose logs -f resultados-estadisticas
```

#### 4. Ver últimas N líneas
```bash
docker compose logs --tail=50 resultados-estadisticas
```

#### 5. Ver logs de múltiples servicios
```bash
docker compose logs resultados-estadisticas postgres-db-resultados eureka-server
```

#### 6. Ver logs desde un tiempo específico
```bash
docker compose logs --since 5m resultados-estadisticas
```

#### 7. Ver logs hasta un tiempo específico
```bash
docker compose logs --until 10m resultados-estadisticas
```

#### 8. Buscar en logs
```bash
docker compose logs resultados-estadisticas | grep -i "error"
docker compose logs resultados-estadisticas | grep -i "eureka"
docker compose logs resultados-estadisticas | grep -i "hikari"
docker compose logs resultados-estadisticas | grep -i "started"
```

---

### COMUNICACIÓN ENTRE SERVICIOS

#### 1. Verificar que PostgreSQL está escuchando
```bash
docker exec bd-resultados pg_isready -U postgres -d resultados_db
```

**Resultado esperado:**
```
/var/run/postgresql:5432 - accepting connections
```

#### 2. Conectarse a PostgreSQL desde el host
```bash
# Usando psql (si está instalado)
psql -h localhost -p 5434 -U postgres -d resultados_db
```

#### 3. Ver tablas en PostgreSQL
```bash
docker exec -it bd-resultados psql -U postgres -d resultados_db -c "\dt"
```

**Resultado esperado:**
```
              List of relations
 Schema |       Name        | Type  |  Owner   
--------+-------------------+-------+----------
 public | resultados_mesa   | table | postgres
```

#### 4. Ver registros en la tabla
```bash
docker exec -it bd-resultados psql -U postgres -d resultados_db -c "SELECT COUNT(*) FROM resultados_mesa;"
```

**Resultado esperado:**
```
 count 
-------
     3
```

#### 5. Verificar variables de entorno del microservicio
```bash
docker exec ms-resultados env | grep -E "(DATASOURCE|EUREKA)"
```

**Resultado esperado:**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db-resultados:5432/resultados_db
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

#### 6. Hacer ping entre contenedores
```bash
# Desde ms-resultados a bd-resultados
docker exec ms-resultados ping -c 3 postgres-db-resultados
```

**Resultado esperado:**
```
PING postgres-db-resultados (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: icmp_seq=0 ttl=64 time=0.123 ms
64 bytes from 172.18.0.3: icmp_seq=1 ttl=64 time=0.098 ms
64 bytes from 172.18.0.3: icmp_seq=2 ttl=64 time=0.102 ms
```

#### 7. Ver red de Docker
```bash
docker network ls
```

**Resultado esperado:**
```
NETWORK ID     NAME                                  DRIVER    SCOPE
abc123def456   boliviandigitalizationvotes_default   bridge    local
```

#### 8. Inspeccionar la red
```bash
docker network inspect boliviandigitalizationvotes_default
```

**Ver qué contenedores están en la red y sus IPs**

---

### PRUEBAS DE ENDPOINTS

#### 1. Probar endpoint del microservicio (directo)
```bash
curl http://localhost:8083/api/resultados
```

#### 2. Probar endpoint a través del Gateway
```bash
curl http://localhost:8080/api/resultados
```

#### 3. Probar health check del microservicio
```bash
curl http://localhost:8083/actuator/health
```

**Resultado esperado:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    }
  }
}
```

#### 4. Probar Eureka desde dentro del contenedor
```bash
docker exec ms-resultados wget -O- http://eureka-server:8761/eureka/apps/RESULTADOS-ESTADISTICAS
```

#### 5. Verificar que Eureka ve el servicio (desde el host)
```bash
curl http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS
```

---

### RECONSTRUCCIÓN Y ACTUALIZACIÓN

#### 1. Reconstruir imagen de un servicio
```bash
docker compose build resultados-estadisticas
```

#### 2. Reconstruir sin caché
```bash
docker compose build --no-cache resultados-estadisticas
```

#### 3. Reconstruir y levantar
```bash
docker compose up -d --build resultados-estadisticas
```

#### 4. Ver progreso de construcción
```bash
docker compose build --progress=plain resultados-estadisticas
```

---

### DEBUGGING

#### 1. Entrar al contenedor (shell interactivo)
```bash
docker exec -it ms-resultados sh
```

**Comandos útiles dentro:**
```bash
# Ver archivos
ls -la

# Ver contenido del JAR
ls -la app.jar

# Ver procesos
ps aux

# Ver variables de entorno
env

# Salir
exit
```

#### 2. Ver procesos corriendo en el contenedor
```bash
docker exec ms-resultados ps aux
```

#### 3. Ver archivos en el contenedor
```bash
docker exec ms-resultados ls -la /app
```

#### 4. Ver contenido de un archivo
```bash
docker exec ms-resultados cat /app/application.properties
```

#### 5. Copiar archivo desde el contenedor al host
```bash
docker cp ms-resultados:/app/app.jar ./app-backup.jar
```

#### 6. Copiar archivo del host al contenedor
```bash
docker cp ./nuevo-archivo.txt ms-resultados:/app/
```

---

### VOLÚMENES

#### 1. Ver volúmenes
```bash
docker volume ls
```

**Resultado esperado:**
```
DRIVER    VOLUME NAME
local     boliviandigitalizationvotes_db-data-resultados
```

#### 2. Inspeccionar volumen
```bash
docker volume inspect boliviandigitalizationvotes_db-data-resultados
```

#### 3. Ver tamaño del volumen
```bash
docker system df -v | grep db-data-resultados
```

#### 4. Hacer backup del volumen
```bash
docker run --rm -v boliviandigitalizationvotes_db-data-resultados:/data -v $(pwd):/backup alpine tar czf /backup/backup-db.tar.gz /data
```

#### 5. Eliminar volumen (¡CUIDADO! Pierde datos)
```bash
docker compose down -v
```

---

### LIMPIEZA

#### 1. Eliminar contenedores detenidos
```bash
docker container prune
```

#### 2. Eliminar imágenes sin usar
```bash
docker image prune
```

#### 3. Eliminar volúmenes sin usar
```bash
docker volume prune
```

#### 4. Limpieza completa (¡CUIDADO!)
```bash
docker system prune -a --volumes
```

#### 5. Ver espacio usado por Docker
```bash
docker system df
```

**Resultado esperado:**
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          10        5         2.5GB     1.2GB (48%)
Containers      5         3         120MB     50MB (41%)
Local Volumes   3         2         450MB     200MB (44%)
Build Cache     50        0         1.2GB     1.2GB
```

---

## 🎯 SECUENCIA COMPLETA DE PRUEBA (DEMO)

```bash
# ========== 1. LIMPIEZA INICIAL ==========
echo "=== Limpiando entorno anterior ==="
docker compose down -v

# ========== 2. CONSTRUCCIÓN ==========
echo -e "\n=== Construyendo imagen ==="
docker compose build resultados-estadisticas

# ========== 3. LEVANTAR SERVICIOS ==========
echo -e "\n=== Levantando servicios ==="
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas api-gateway

# ========== 4. ESPERAR INICIALIZACIÓN ==========
echo -e "\n=== Esperando 20 segundos... ==="
Start-Sleep -Seconds 20

# ========== 5. VERIFICAR ESTADO ==========
echo -e "\n=== Estado de los contenedores ==="
docker ps | grep -E "(eureka|gateway|resultados|postgres)"

# ========== 6. VERIFICAR HEALTH CHECKS ==========
echo -e "\n=== Verificando health check de PostgreSQL ==="
docker inspect bd-resultados | grep -A 2 '"Status"'

# ========== 7. VER LOGS ==========
echo -e "\n=== Últimos logs del microservicio ==="
docker compose logs --tail=20 resultados-estadisticas

# ========== 8. VERIFICAR COMUNICACIÓN BD ==========
echo -e "\n=== Verificando conexión a PostgreSQL ==="
docker exec bd-resultados pg_isready -U postgres -d resultados_db

# ========== 9. VERIFICAR REGISTRO EN EUREKA ==========
echo -e "\n=== Verificando registro en Eureka ==="
curl -s http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS | grep -o "<status>UP</status>"

# ========== 10. PROBAR ENDPOINTS ==========
echo -e "\n=== Probando endpoint directo ==="
curl -s http://localhost:8083/api/resultados/1

echo -e "\n=== Probando endpoint a través del Gateway ==="
curl -s http://localhost:8080/api/resultados/1

echo -e "\n=== Probando health check ==="
curl -s http://localhost:8083/actuator/health

# ========== 11. VERIFICAR VARIABLES DE ENTORNO ==========
echo -e "\n=== Variables de entorno del microservicio ==="
docker exec ms-resultados env | grep -E "(DATASOURCE|EUREKA)"

# ========== 12. ESTADÍSTICAS ==========
echo -e "\n=== Uso de recursos ==="
docker stats --no-stream ms-resultados

echo -e "\n=== ✅ TODAS LAS PRUEBAS COMPLETADAS ==="
```

---

## 📊 TABLA DE VERIFICACIÓN

| Prueba | Comando | Resultado esperado |
|--------|---------|-------------------|
| Imagen construida | `docker images \| grep resultados` | Imagen listada |
| Servicios corriendo | `docker ps` | 4+ contenedores UP |
| Health check | `docker inspect bd-resultados` | Status: healthy |
| Logs sin errores | `docker compose logs resultados` | Sin ERROR/FATAL |
| BD accesible | `docker exec bd-resultados pg_isready` | accepting connections |
| Eureka registrado | `curl localhost:8761/eureka/apps/...` | Status: UP |
| Endpoint directo | `curl localhost:8083/api/resultados` | JSON con datos |
| Endpoint Gateway | `curl localhost:8080/api/resultados` | JSON con datos |
| Health check app | `curl localhost:8083/actuator/health` | status: UP |
| Variables de entorno | `docker exec ms-resultados env` | DATASOURCE y EUREKA |

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Problema: Contenedor no inicia

```bash
# Ver logs detallados
docker compose logs resultados-estadisticas

# Ver últimos eventos
docker events --since 5m

# Ver por qué falló
docker inspect ms-resultados | grep -A 10 State
```

### Problema: No se conecta a PostgreSQL

```bash
# Verificar que PostgreSQL está healthy
docker ps | grep bd-resultados

# Probar conexión manualmente
docker exec bd-resultados pg_isready -U postgres

# Ver variables de entorno
docker exec ms-resultados env | grep DATASOURCE

# Ver logs de PostgreSQL
docker compose logs postgres-db-resultados
```

### Problema: No se registra en Eureka

```bash
# Ver logs del microservicio
docker compose logs resultados-estadisticas | grep -i eureka

# Ver si Eureka está corriendo
curl http://localhost:8761

# Verificar variable de entorno
docker exec ms-resultados env | grep EUREKA
```

### Problema: Gateway no responde

```bash
# Ver logs del Gateway
docker compose logs api-gateway

# Verificar que Gateway ve a Eureka
docker compose logs api-gateway | grep -i eureka

# Probar acceso directo al microservicio
curl http://localhost:8083/api/resultados
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Antes de la demo
- [ ] `docker compose down -v` (limpiar)
- [ ] `docker compose build` (construir)
- [ ] `docker compose up -d` (levantar)
- [ ] Esperar 20 segundos

### Durante la demo
- [ ] `docker ps` muestra servicios UP
- [ ] `docker inspect` muestra healthy
- [ ] `docker compose logs` sin errores
- [ ] `curl localhost:8083/api/resultados` funciona
- [ ] `curl localhost:8080/api/resultados` funciona
- [ ] `curl localhost:8761` muestra Eureka
- [ ] PostgreSQL acepta conexiones

---

**🐳 LISTO PARA DEMOSTRAR EL CRITERIO 4: DOCKER**

