# 🧪 COMANDOS DE PRUEBA - CRITERIO 2: EUREKA

## 🚀 Inicio

```bash
# Levantar servicios necesarios
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas api-gateway
```

---

## ✅ PRUEBA 1: Eureka Server levanta correctamente

### Verificar contenedor
```bash
docker ps | grep eureka
```

**Resultado esperado:**
```
eureka-server   Up X minutes   0.0.0.0:8761->8761/tcp
```

### Acceder al Dashboard
```
http://localhost:8761
```

**Resultado esperado:**
- Dashboard de Eureka carga correctamente
- Se ve la interfaz web con el logo de Eureka

---

## ✅ PRUEBA 2: Microservicios registrados en Eureka

### Ver Dashboard (navegador)
```
http://localhost:8761
```

**Buscar la sección:** "Instances currently registered with Eureka"

**Debe aparecer:**
```
Application                    AMIs    Availability Zones    Status
RESULTADOS-ESTADISTICAS       n/a (1)  (1)                   UP (1) - ...
API-GATEWAY                   n/a (1)  (1)                   UP (1) - ...
```

### Consultar API de Eureka (XML)
```bash
curl http://localhost:8761/eureka/apps
```

### Consultar API de Eureka (JSON)
```bash
curl -H "Accept: application/json" http://localhost:8761/eureka/apps | jq .
```

### Consultar servicio específico
```bash
# Ver solo RESULTADOS-ESTADISTICAS
curl -H "Accept: application/json" http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS | jq .
```

**Resultado esperado:**
```json
{
  "application": {
    "name": "RESULTADOS-ESTADISTICAS",
    "instance": [
      {
        "instanceId": "...",
        "hostName": "...",
        "app": "RESULTADOS-ESTADISTICAS",
        "ipAddr": "172.x.x.x",
        "status": "UP",
        "port": {
          "$": 8083,
          "@enabled": "true"
        },
        ...
      }
    ]
  }
}
```

### Ver logs de registro
```bash
docker compose logs resultados-estadisticas | grep -i "eureka"
```

**Buscar líneas como:**
```
DiscoveryClient_RESULTADOS-ESTADISTICAS/... - registration status: 204
Registered with Eureka server...
```

---

## ✅ PRUEBA 3: Descubrimiento dinámico

### Opción A: A través del API Gateway

El API Gateway usa el **nombre lógico** `RESULTADOS-ESTADISTICAS` para enrutar las peticiones.

#### 1. Acceso directo al microservicio (sin Gateway)
```bash
curl http://localhost:8083/api/resultados
```

#### 2. Acceso a través del Gateway (con descubrimiento dinámico)
```bash
curl http://localhost:8080/api/resultados
```

**Explicación:**
- El Gateway recibe la petición en `http://localhost:8080/api/resultados`
- Busca en su configuración la ruta que coincida: `- Path=/api/resultados/**`
- Resuelve el URI: `lb://RESULTADOS-ESTADISTICAS`
- `lb://` indica "Load Balancer", que usa Eureka para resolver el nombre
- Eureka devuelve la IP y puerto real del servicio
- El Gateway envía la petición a `http://172.x.x.x:8083/api/resultados`

**Resultado esperado:**
- Ambos comandos retornan los mismos datos
- El segundo usa el nombre lógico, **NO una IP hardcodeada**

---

### Opción B: Ver configuración del Gateway

```bash
cat api-gateway/src/main/resources/application.yml | grep -A 5 "resultados"
```

**Debe mostrar:**
```yaml
- id: resultados_service_route
  uri: lb://RESULTADOS-ESTADISTICAS  # ← Nombre lógico, NO IP
  predicates:
    - Path=/api/resultados/**
```

**Nota:** `lb://` significa "Load Balanced" y le indica a Spring Cloud Gateway que use Eureka para resolver el nombre.

---

## 🧪 PRUEBAS ADICIONALES

### Probar diferentes endpoints a través del Gateway

```bash
# Listar todos los resultados
curl http://localhost:8080/api/resultados

# Obtener resultado por ID
curl http://localhost:8080/api/resultados/1

# Derived Query
curl http://localhost:8080/api/resultados/departamento/La%20Paz

# JPQL Query
curl http://localhost:8080/api/resultados/inscritos-minimo/300

# Native Query
curl http://localhost:8080/api/resultados/votos-validos-minimo/200

# Estadísticas
curl http://localhost:8080/api/resultados/estadisticas
```

### Acceder a Swagger a través del Gateway

```
http://localhost:8080/resultados/swagger-ui/index.html
```

### Verificar health del microservicio

```bash
# Directo
curl http://localhost:8083/actuator/health

# A través del Gateway
curl http://localhost:8080/resultados/actuator/health
```

---

## 📊 DEMOSTRACIÓN COMPLETA (5 minutos)

### 1. Mostrar Dashboard de Eureka (1 min)
```
http://localhost:8761
```

**Puntos clave:**
- Eureka Server está UP
- `RESULTADOS-ESTADISTICAS` registrado y UP
- `API-GATEWAY` registrado y UP

### 2. Mostrar configuración de Eureka Client (1 min)
```bash
cat resultados_estadisticas/src/main/resources/application.properties | grep -A 3 "eureka"
```

**Mostrar:**
```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
eureka.instance.prefer-ip-address=true
```

### 3. Consultar API de Eureka (1 min)
```bash
curl -H "Accept: application/json" http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS | jq .
```

### 4. Mostrar configuración del Gateway (1 min)
```bash
cat api-gateway/src/main/resources/application.yml | grep -B 2 -A 4 "resultados_service_route"
```

**Mostrar:**
```yaml
- id: resultados_service_route
  uri: lb://RESULTADOS-ESTADISTICAS  # ← Nombre lógico
  predicates:
    - Path=/api/resultados/**
```

### 5. Probar descubrimiento dinámico (1 min)
```bash
# Acceso directo
curl http://localhost:8083/api/resultados

# A través del Gateway (usa Eureka para resolver)
curl http://localhost:8080/api/resultados
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Eureka Server corriendo y Dashboard accesible
- [ ] `RESULTADOS-ESTADISTICAS` aparece en Eureka con status UP
- [ ] `API-GATEWAY` aparece en Eureka con status UP
- [ ] API de Eureka retorna información del servicio
- [ ] Logs muestran registro exitoso
- [ ] Gateway tiene ruta configurada con `lb://RESULTADOS-ESTADISTICAS`
- [ ] Peticiones a través del Gateway funcionan
- [ ] Swagger accesible a través del Gateway
- [ ] Actuator accesible a través del Gateway

---

## 🎯 EVIDENCIAS PARA LA DOCENTE

### Evidencia 1: Eureka Server funcional
- **URL:** http://localhost:8761
- **Captura:** Dashboard mostrando servicios registrados

### Evidencia 2: Microservicio registrado
- **Dashboard:** Sección "Instances currently registered"
- **API:** `curl http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS`
- **Logs:** Mostrar "Registered with Eureka"

### Evidencia 3: Descubrimiento dinámico
- **Código Gateway:** Mostrar `uri: lb://RESULTADOS-ESTADISTICAS`
- **Prueba funcional:** Comparar acceso directo vs. a través del Gateway
- **Explicación:** NO hay IPs hardcodeadas, solo nombres lógicos

---

## 🔄 Si algo no funciona

### Reiniciar servicios
```bash
docker compose down
docker compose up -d eureka-server postgres-db-resultados
# Esperar ~15 segundos
docker compose up -d resultados-estadisticas api-gateway
```

### Ver logs en tiempo real
```bash
# Eureka Server
docker compose logs -f eureka-server

# Resultados Estadísticas
docker compose logs -f resultados-estadisticas

# API Gateway
docker compose logs -f api-gateway
```

### Verificar que todos los servicios están UP
```bash
docker ps | grep -E "(eureka|ms-resultados|api-gateway)"
```

---

## ✅ RESUMEN

**3 Criterios cumplidos:**

1. ✅ **Eureka Server levanta correctamente**
   - Dashboard accesible en http://localhost:8761

2. ✅ **Microservicios se registran en Eureka**
   - `RESULTADOS-ESTADISTICAS` visible en dashboard y API

3. ✅ **Descubrimiento dinámico funcional**
   - Gateway usa `lb://RESULTADOS-ESTADISTICAS` (nombre lógico)
   - Eureka resuelve automáticamente la ubicación del servicio
   - NO hay IPs hardcodeadas

