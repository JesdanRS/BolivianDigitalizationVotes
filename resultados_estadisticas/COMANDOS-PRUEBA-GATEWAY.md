# 🧪 COMANDOS DE PRUEBA - CRITERIO 3: GATEWAY

## 🚀 Verificación Inicial

```bash
# Ver que todos los servicios estén corriendo
docker ps | grep -E "(api-gateway|eureka|ms-resultados)"
```

---

## ✅ PRUEBA 1: Configuración básica del Gateway

### 1.1 GET - Listar todos los resultados
```bash
curl http://localhost:8080/api/resultados
```

### 1.2 GET - Obtener resultado por ID
```bash
curl http://localhost:8080/api/resultados/1
```

### 1.3 GET - Derived Query (por departamento)
```bash
curl http://localhost:8080/api/resultados/departamento/La%20Paz
```

### 1.4 GET - JPQL Query (inscritos mínimos)
```bash
curl http://localhost:8080/api/resultados/inscritos-minimo/300
```

### 1.5 GET - Native Query (votos válidos mínimos)
```bash
curl http://localhost:8080/api/resultados/votos-validos-minimo/200
```

### 1.6 GET - Estadísticas
```bash
curl http://localhost:8080/api/resultados/estadisticas
```

### 1.7 GET - Estadísticas por departamento
```bash
curl http://localhost:8080/api/resultados/estadisticas/La%20Paz
```

### 1.8 POST - Crear nuevo resultado
```bash
curl -X POST http://localhost:8080/api/resultados \
  -H "Content-Type: application/json" \
  -d '{
    "departamento": "Pando",
    "municipio": "Cobija",
    "recinto": "Escuela Central",
    "mesa": "Mesa 20",
    "inscritos": 150,
    "votosValidosPresencial": 90,
    "votosNulosPresencial": 5,
    "votosBlancosPresencial": 2,
    "votosValidosWeb": 40,
    "votosNulosWeb": 3,
    "votosBlancosWeb": 1
  }'
```

### 1.9 PUT - Actualizar resultado
```bash
curl -X PUT http://localhost:8080/api/resultados/1 \
  -H "Content-Type: application/json" \
  -d '{
    "departamento": "La Paz",
    "municipio": "La Paz",
    "recinto": "Coliseo Central ACTUALIZADO VIA GATEWAY",
    "mesa": "Mesa 1",
    "inscritos": 400,
    "votosValidosPresencial": 250,
    "votosNulosPresencial": 20,
    "votosBlancosPresencial": 8,
    "votosValidosWeb": 100,
    "votosNulosWeb": 10,
    "votosBlancosWeb": 5
  }'
```

### 1.10 DELETE - Eliminar resultado
```bash
# Crear uno primero para eliminarlo
curl -X POST http://localhost:8080/api/resultados \
  -H "Content-Type: application/json" \
  -d '{"departamento":"Test","municipio":"Test","recinto":"Test","mesa":"Test","inscritos":100,"votosValidosPresencial":50,"votosNulosPresencial":5,"votosBlancosPresencial":2,"votosValidosWeb":30,"votosNulosWeb":3,"votosBlancosWeb":1}'

# Luego eliminarlo (usar el ID que retornó)
curl -X DELETE http://localhost:8080/api/resultados/5
```

---

## ✅ PRUEBA 2: Uso de predicados y filtros

### 2.1 Path Predicate - Diferentes rutas
```bash
# Ruta base
curl http://localhost:8080/api/resultados

# Ruta con parámetro de path
curl http://localhost:8080/api/resultados/1

# Ruta con múltiples segmentos
curl http://localhost:8080/api/resultados/departamento/La%20Paz

# Ruta con query parameter
curl "http://localhost:8080/api/resultados/estadisticas?canal=presencial"
```

### 2.2 RewritePath Filter - Actuator
```bash
# A través del Gateway (con RewritePath)
curl http://localhost:8080/resultados/actuator/health

# La ruta original en el microservicio sería:
# http://localhost:8083/actuator/health

# El filtro elimina el prefijo "/resultados" antes de enviarlo
```

### 2.3 RewritePath Filter - Swagger UI
```bash
# A través del Gateway (con RewritePath)
curl http://localhost:8080/resultados/swagger-ui/index.html

# El Gateway transforma:
# Entrada: /resultados/swagger-ui/index.html
# Salida al microservicio: /swagger-ui/index.html
```

### 2.4 RewritePath Filter - OpenAPI Docs
```bash
# A través del Gateway
curl http://localhost:8080/resultados/v3/api-docs

# El Gateway transforma:
# Entrada: /resultados/v3/api-docs
# Salida al microservicio: /v3/api-docs
```

### 2.5 Comparación: Con y sin Gateway

**Sin Gateway (acceso directo):**
```bash
curl http://localhost:8083/api/resultados
```

**Con Gateway (enrutamiento):**
```bash
curl http://localhost:8080/api/resultados
```

**Resultado:** Ambos deben retornar los mismos datos, pero el segundo pasa por el Gateway.

---

## ✅ PRUEBA 3: Documentación API (Swagger/OpenAPI)

### 3.1 Swagger UI - Navegador
```
Abrir en el navegador:
http://localhost:8080/resultados/swagger-ui/index.html
```

**Verificar:**
- ✅ Interfaz de Swagger carga correctamente
- ✅ Se muestran todos los endpoints
- ✅ Se puede probar "GET /api/resultados"
- ✅ Se puede probar "POST /api/resultados"

### 3.2 OpenAPI JSON Specification
```bash
curl http://localhost:8080/resultados/v3/api-docs | jq .
```

**Resultado esperado:**
```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "OpenAPI definition",
    "version": "v0"
  },
  "servers": [...],
  "paths": {
    "/api/resultados": {
      "get": {...},
      "post": {...}
    },
    "/api/resultados/{id}": {
      "get": {...},
      "put": {...},
      "delete": {...}
    },
    ...
  }
}
```

### 3.3 OpenAPI YAML Specification
```bash
curl http://localhost:8080/resultados/v3/api-docs.yaml
```

### 3.4 Probar endpoint desde Swagger

1. Abrir: http://localhost:8080/resultados/swagger-ui/index.html
2. Expandir `GET /api/resultados`
3. Click en "Try it out"
4. Click en "Execute"
5. Verificar que retorna datos correctamente

---

## 🎯 PRUEBA COMPLETA PARA LA DEMO

### Secuencia de comandos (10 min)

```bash
# ========== VERIFICACIÓN INICIAL ==========
echo "=== 1. Verificando servicios ==="
docker ps | grep -E "(api-gateway|eureka|ms-resultados)"

# ========== CRUD A TRAVÉS DEL GATEWAY ==========
echo -e "\n=== 2. GET - Listar todos ==="
curl http://localhost:8080/api/resultados

echo -e "\n=== 3. GET - Obtener por ID ==="
curl http://localhost:8080/api/resultados/1

echo -e "\n=== 4. GET - Buscar por departamento (Derived Query) ==="
curl http://localhost:8080/api/resultados/departamento/La%20Paz

echo -e "\n=== 5. GET - Buscar por inscritos (JPQL Query) ==="
curl http://localhost:8080/api/resultados/inscritos-minimo/300

echo -e "\n=== 6. GET - Buscar por votos válidos (Native Query) ==="
curl http://localhost:8080/api/resultados/votos-validos-minimo/200

echo -e "\n=== 7. POST - Crear nuevo resultado ==="
curl -X POST http://localhost:8080/api/resultados \
  -H "Content-Type: application/json" \
  -d '{"departamento":"Tarija","municipio":"Tarija","recinto":"Colegio Central","mesa":"Mesa 25","inscritos":180,"votosValidosPresencial":110,"votosNulosPresencial":8,"votosBlancosPresencial":3,"votosValidosWeb":45,"votosNulosWeb":4,"votosBlancosWeb":2}'

# ========== PREDICADOS Y FILTROS ==========
echo -e "\n=== 8. RewritePath - Actuator Health ==="
curl http://localhost:8080/resultados/actuator/health

echo -e "\n=== 9. RewritePath - OpenAPI Docs ==="
curl http://localhost:8080/resultados/v3/api-docs | head -20

# ========== SWAGGER UI ==========
echo -e "\n=== 10. Swagger UI ==="
echo "Abrir en navegador: http://localhost:8080/resultados/swagger-ui/index.html"
```

---

## 📊 COMPARACIÓN: Directo vs Gateway

### Tabla de comparación

| Descripción | Acceso Directo | A través del Gateway | Estado |
|-------------|----------------|----------------------|--------|
| Listar todos | `http://localhost:8083/api/resultados` | `http://localhost:8080/api/resultados` | ✅ |
| Por ID | `http://localhost:8083/api/resultados/1` | `http://localhost:8080/api/resultados/1` | ✅ |
| Por departamento | `http://localhost:8083/api/resultados/departamento/La%20Paz` | `http://localhost:8080/api/resultados/departamento/La%20Paz` | ✅ |
| Swagger UI | `http://localhost:8083/swagger-ui/index.html` | `http://localhost:8080/resultados/swagger-ui/index.html` | ✅ |
| Actuator | `http://localhost:8083/actuator/health` | `http://localhost:8080/resultados/actuator/health` | ✅ |

---

## 🔍 ANÁLISIS DE ENRUTAMIENTO

### Ejemplo detallado: `GET /api/resultados`

**1. Cliente envía petición:**
```
GET http://localhost:8080/api/resultados
```

**2. Gateway recibe en puerto 8080**

**3. Gateway busca ruta que coincida:**
```yaml
- id: resultados_service_route
  uri: lb://RESULTADOS-ESTADISTICAS
  predicates:
    - Path=/api/resultados/**
```

**4. Gateway consulta a Eureka:**
```
"¿Dónde está RESULTADOS-ESTADISTICAS?"
Eureka responde: "172.18.0.5:8083"
```

**5. Gateway reenvía petición:**
```
GET http://172.18.0.5:8083/api/resultados
```

**6. Microservicio procesa y responde**

**7. Gateway retorna respuesta al cliente**

---

## 🛠️ TROUBLESHOOTING

### Problema: "404 Not Found"
```bash
# Verificar que la ruta está configurada
grep -A 5 "resultados_service_route" api-gateway/src/main/resources/application.yml

# Verificar que el Gateway está registrado en Eureka
curl http://localhost:8761/eureka/apps | grep API-GATEWAY
```

### Problema: "503 Service Unavailable"
```bash
# Verificar que el microservicio está en Eureka
curl http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS

# Verificar que el microservicio está corriendo
docker ps | grep ms-resultados
```

### Problema: Swagger no carga
```bash
# Verificar ruta de Swagger
curl http://localhost:8080/resultados/swagger-ui/index.html

# Si falla, probar acceso directo
curl http://localhost:8083/swagger-ui/index.html
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

### Antes de la demo:
- [ ] Todos los servicios corriendo (Eureka, Gateway, Microservicio)
- [ ] Microservicio registrado en Eureka
- [ ] Gateway puede acceder al microservicio

### Configuración básica del Gateway:
- [ ] GET a `/api/resultados` funciona
- [ ] POST a `/api/resultados` funciona
- [ ] PUT a `/api/resultados/{id}` funciona
- [ ] DELETE a `/api/resultados/{id}` funciona
- [ ] Queries (Derived, JPQL, Native) funcionan

### Predicados y filtros:
- [ ] Path predicate funciona correctamente
- [ ] RewritePath para Swagger funciona
- [ ] RewritePath para Actuator funciona
- [ ] Múltiples rutas configuradas

### Documentación API:
- [ ] Swagger UI accesible a través del Gateway
- [ ] OpenAPI JSON accesible
- [ ] Endpoints documentados en Swagger
- [ ] Se pueden probar endpoints desde Swagger

---

## ✅ COMANDOS MÁS IMPORTANTES

```bash
# 1. Verificar Gateway está corriendo
docker ps | grep api-gateway

# 2. Listar resultados
curl http://localhost:8080/api/resultados

# 3. Swagger UI (navegador)
# http://localhost:8080/resultados/swagger-ui/index.html

# 4. Health check con RewritePath
curl http://localhost:8080/resultados/actuator/health

# 5. Crear resultado
curl -X POST http://localhost:8080/api/resultados -H "Content-Type: application/json" -d '{"departamento":"Oruro","municipio":"Oruro","recinto":"Test","mesa":"Mesa 1","inscritos":100,"votosValidosPresencial":50,"votosNulosPresencial":5,"votosBlancosPresencial":2,"votosValidosWeb":30,"votosNulosWeb":3,"votosBlancosWeb":1}'
```

---

**🎯 LISTO PARA DEMOSTRAR EL CRITERIO 3: EDGE SERVER (GATEWAY)**

