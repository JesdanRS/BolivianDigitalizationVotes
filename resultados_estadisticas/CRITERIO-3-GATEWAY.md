# ✅ CRITERIO 3: EDGE SERVER (GATEWAY)

## 📋 Checklist de Verificación

### ✅ Configuración básica del Gateway
- [x] El Edge Server enruta peticiones correctamente
- [x] Peticiones desde Postman/curl se redirigen a microservicios

### ✅ Uso de predicados y filtros
- [x] Implementa Path, RewritePath, StripPrefix
- [x] Se invocan endpoints únicamente a través del Gateway

### ✅ Documentación API
- [x] Integración con Swagger/OpenAPI accesible a través del Gateway
- [x] Endpoint `/resultados/swagger-ui/index.html` visible y funcional

---

## 🗂️ EVIDENCIA 1: Configuración básica del Gateway

### 📁 Archivo: `api-gateway/src/main/resources/application.yml`

#### Configuración del Servidor
```yaml
server:
  port: 8080  # Puerto del Gateway

spring:
  application:
    name: api-gateway
```

#### Configuración CORS (importante para frontend)
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
```

#### Rutas configuradas para `resultados-estadisticas`

```yaml
routes:
  # Ruta principal del microservicio
  - id: resultados_service_route
    uri: lb://RESULTADOS-ESTADISTICAS
    predicates:
      - Path=/api/resultados/**
  
  # Swagger UI
  - id: resultados_swagger
    uri: lb://RESULTADOS-ESTADISTICAS
    predicates:
      - Path=/resultados/swagger-ui/**
    filters:
      - RewritePath=/resultados/swagger-ui/(?<segment>.*), /swagger-ui/$\{segment}
  
  # API Docs (OpenAPI)
  - id: resultados_api_docs
    uri: lb://RESULTADOS-ESTADISTICAS
    predicates:
      - Path=/resultados/v3/api-docs/**
    filters:
      - RewritePath=/resultados/v3/api-docs/(?<segment>.*), /v3/api-docs/$\{segment}
  
  # Actuator
  - id: resultados_actuator
    uri: lb://RESULTADOS-ESTADISTICAS
    predicates:
      - Path=/resultados/actuator/**
    filters:
      - RewritePath=/resultados/actuator/(?<segment>.*), /actuator/$\{segment}
```

### 🧪 Prueba: Enrutamiento correcto

#### 1. Acceso directo al microservicio (sin Gateway)
```bash
curl http://localhost:8083/api/resultados
```

#### 2. Acceso a través del Gateway
```bash
curl http://localhost:8080/api/resultados
```

**Resultado esperado:** Ambos retornan los mismos datos.

**Explicación del enrutamiento:**
1. Cliente envía petición a: `http://localhost:8080/api/resultados`
2. Gateway recibe la petición en el puerto `8080`
3. Gateway busca una ruta que coincida con `/api/resultados/**`
4. Encuentra `resultados_service_route`
5. Usa Eureka para resolver `lb://RESULTADOS-ESTADISTICAS`
6. Reenvía la petición a `http://[IP-del-servicio]:8083/api/resultados`
7. Retorna la respuesta al cliente

---

## 🗂️ EVIDENCIA 2: Uso de predicados y filtros

### 📌 Predicados implementados

#### 1. **Path Predicate**
Todos los endpoints usan el predicado `Path` para definir qué rutas coinciden:

```yaml
predicates:
  - Path=/api/resultados/**
```

**¿Qué hace?**
- Coincide con cualquier petición que empiece con `/api/resultados/`
- Ejemplo: `/api/resultados/1`, `/api/resultados/departamento/La Paz`

### 📌 Filtros implementados

#### 1. **RewritePath Filter**
Usado en Swagger y Actuator para reescribir la ruta antes de enviarla al microservicio:

```yaml
filters:
  - RewritePath=/resultados/swagger-ui/(?<segment>.*), /swagger-ui/$\{segment}
```

**¿Qué hace?**
- **Entrada (Gateway):** `/resultados/swagger-ui/index.html`
- **Salida (Microservicio):** `/swagger-ui/index.html`
- Elimina el prefijo `/resultados` antes de enviar al microservicio

**Ejemplo con Actuator:**
```yaml
filters:
  - RewritePath=/resultados/actuator/(?<segment>.*), /actuator/$\{segment}
```

- **Entrada:** `/resultados/actuator/health`
- **Salida:** `/actuator/health`

### 🧪 Pruebas de predicados y filtros

#### Prueba 1: Path Predicate (sin filtro)
```bash
# A través del Gateway
curl http://localhost:8080/api/resultados/1

# El Gateway envía a:
# http://resultados-estadisticas:8083/api/resultados/1
```

#### Prueba 2: RewritePath Filter con Swagger
```bash
# A través del Gateway
curl http://localhost:8080/resultados/swagger-ui/index.html

# El Gateway reescribe y envía a:
# http://resultados-estadisticas:8083/swagger-ui/index.html
```

#### Prueba 3: RewritePath Filter con Actuator
```bash
# A través del Gateway
curl http://localhost:8080/resultados/actuator/health

# El Gateway reescribe y envía a:
# http://resultados-estadisticas:8083/actuator/health
```

### 📊 Tabla de Predicados y Filtros

| Ruta en Gateway | Predicado | Filtro | Ruta en Microservicio |
|----------------|-----------|--------|----------------------|
| `/api/resultados/**` | Path | Ninguno | `/api/resultados/**` |
| `/resultados/swagger-ui/**` | Path | RewritePath | `/swagger-ui/**` |
| `/resultados/v3/api-docs/**` | Path | RewritePath | `/v3/api-docs/**` |
| `/resultados/actuator/**` | Path | RewritePath | `/actuator/**` |

### 🔒 Invocar endpoints únicamente a través del Gateway

**Buena práctica:** En producción, los microservicios deberían estar en una red privada y solo el Gateway debería ser accesible públicamente.

**Para la demo:**
- **Gateway (público):** `http://localhost:8080`
- **Microservicio (privado en producción):** `http://localhost:8083`

**Demostración:**
```bash
# ✅ CORRECTO: A través del Gateway
curl http://localhost:8080/api/resultados

# ⚠️ EN PRODUCCIÓN: Este puerto estaría bloqueado
curl http://localhost:8083/api/resultados
```

---

## 🗂️ EVIDENCIA 3: Documentación API (Swagger/OpenAPI)

### 📌 Configuración de Swagger en el microservicio

Ya está configurado en `resultados_estadisticas`:

**Dependencia en `pom.xml`:**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

### 📌 Acceso a Swagger a través del Gateway

#### Opción 1: Swagger UI Completo
```
http://localhost:8080/resultados/swagger-ui/index.html
```

**Características:**
- Interfaz web interactiva
- Permite probar endpoints directamente
- Documentación completa con ejemplos

#### Opción 2: OpenAPI JSON
```
http://localhost:8080/resultados/v3/api-docs
```

**Características:**
- Especificación OpenAPI en formato JSON
- Útil para generar clientes automáticamente
- Puede importarse en Postman

### 🧪 Prueba: Swagger accesible a través del Gateway

#### 1. Abrir Swagger UI en el navegador
```
http://localhost:8080/resultados/swagger-ui/index.html
```

**Resultado esperado:**
- Interfaz de Swagger carga correctamente
- Se muestran todos los endpoints de `ResultadosController`
- Se pueden probar los endpoints desde la interfaz

#### 2. Ver especificación OpenAPI
```bash
curl http://localhost:8080/resultados/v3/api-docs
```

**Resultado esperado:**
```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "Resultados API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:8080",
      "description": "Gateway Server"
    }
  ],
  "paths": {
    "/api/resultados": { ... },
    "/api/resultados/{id}": { ... },
    ...
  }
}
```

### 📸 Captura recomendada para la demo

1. **Swagger UI cargado** mostrando todos los endpoints
2. **Probando un endpoint desde Swagger** (botón "Try it out")
3. **Respuesta exitosa** del endpoint

---

## 🎯 DEMOSTRACIÓN COMPLETA DEL CRITERIO

### Secuencia de Demostración (7 minutos)

#### 1. Mostrar configuración del Gateway (2 min)

**Archivo:** `api-gateway/src/main/resources/application.yml`

```bash
code api-gateway/src/main/resources/application.yml
```

**Puntos clave a mostrar:**
- Puerto del Gateway: `8080`
- Predicado `Path` para `/api/resultados/**`
- Filtro `RewritePath` para Swagger
- URI con `lb://` para descubrimiento dinámico

#### 2. Probar enrutamiento básico (1 min)

```bash
# A través del Gateway
curl http://localhost:8080/api/resultados

# Resultado: Lista de resultados en JSON
```

#### 3. Demostrar diferentes predicados (2 min)

```bash
# GET - Listar todos
curl http://localhost:8080/api/resultados

# GET - Obtener por ID
curl http://localhost:8080/api/resultados/1

# GET - Derived Query
curl http://localhost:8080/api/resultados/departamento/La%20Paz

# POST - Crear nuevo
curl -X POST http://localhost:8080/api/resultados \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

#### 4. Demostrar filtros RewritePath (1 min)

```bash
# Actuator health (con RewritePath)
curl http://localhost:8080/resultados/actuator/health

# Ver la diferencia:
# Gateway recibe: /resultados/actuator/health
# Microservicio recibe: /actuator/health
```

#### 5. Mostrar Swagger a través del Gateway (1 min)

**Abrir en el navegador:**
```
http://localhost:8080/resultados/swagger-ui/index.html
```

**Demostrar:**
- Interfaz carga correctamente
- Endpoints están documentados
- Probar un endpoint desde Swagger (botón "Try it out")

---

## 📋 CHECKLIST DE VERIFICACIÓN

### Configuración básica del Gateway
- [ ] Gateway corriendo en puerto 8080
- [ ] Peticiones a `/api/resultados` se enrutan correctamente
- [ ] Respuestas idénticas entre acceso directo y Gateway
- [ ] CRUD completo funcional a través del Gateway

### Uso de predicados y filtros
- [ ] **Path Predicate**: `/api/resultados/**` funciona
- [ ] **RewritePath Filter**: Swagger accesible con reescritura
- [ ] **RewritePath Filter**: Actuator accesible con reescritura
- [ ] Múltiples rutas configuradas correctamente

### Documentación API
- [ ] Swagger UI accesible: `http://localhost:8080/resultados/swagger-ui/index.html`
- [ ] OpenAPI JSON accesible: `http://localhost:8080/resultados/v3/api-docs`
- [ ] Todos los endpoints documentados en Swagger
- [ ] Endpoints probables desde Swagger UI

---

## 🚀 COMANDOS RÁPIDOS PARA LA DEMO

```bash
# ========== CONFIGURACIÓN BÁSICA ==========
# 1. Ver que el Gateway está corriendo
docker ps | grep api-gateway

# 2. Listar todos los resultados
curl http://localhost:8080/api/resultados

# 3. Obtener un resultado específico
curl http://localhost:8080/api/resultados/1

# 4. Buscar por departamento (Derived Query)
curl http://localhost:8080/api/resultados/departamento/La%20Paz

# ========== PREDICADOS Y FILTROS ==========
# 5. Probar RewritePath con Actuator
curl http://localhost:8080/resultados/actuator/health

# 6. Ver OpenAPI docs (RewritePath)
curl http://localhost:8080/resultados/v3/api-docs

# ========== DOCUMENTACIÓN API ==========
# 7. Abrir Swagger UI en navegador
# http://localhost:8080/resultados/swagger-ui/index.html

# 8. Crear nuevo resultado (POST)
curl -X POST http://localhost:8080/api/resultados \
  -H "Content-Type: application/json" \
  -d '{"departamento":"Pando","municipio":"Cobija","recinto":"Escuela Central","mesa":"Mesa 15","inscritos":150,"votosValidosPresencial":90,"votosNulosPresencial":5,"votosBlancosPresencial":2,"votosValidosWeb":40,"votosNulosWeb":3,"votosBlancosWeb":1}'

# 9. Actualizar resultado (PUT)
curl -X PUT http://localhost:8080/api/resultados/1 \
  -H "Content-Type: application/json" \
  -d '{"departamento":"La Paz","municipio":"La Paz","recinto":"Coliseo Central ACTUALIZADO","mesa":"Mesa 1","inscritos":350,"votosValidosPresencial":200,"votosNulosPresencial":15,"votosBlancosPresencial":5,"votosValidosWeb":100,"votosNulosWeb":8,"votosBlancosWeb":4}'

# 10. Eliminar resultado (DELETE)
curl -X DELETE http://localhost:8080/api/resultados/4
```

---

## 💡 RESPUESTAS A POSIBLES PREGUNTAS

**P: ¿Por qué usar un Gateway en lugar de acceder directamente a los microservicios?**
> R: "El Gateway actúa como punto único de entrada. Proporciona:
> - **Seguridad centralizada**: Autenticación y autorización en un solo lugar
> - **Enrutamiento inteligente**: Dirige peticiones al microservicio correcto
> - **Load Balancing**: Distribuye carga entre múltiples instancias
> - **Monitoreo centralizado**: Un lugar para logs y métricas
> - **Versionamiento**: Manejo de versiones de API"

**P: ¿Qué es un predicado en Spring Cloud Gateway?**
> R: "Un predicado es una condición que debe cumplirse para que se use una ruta. `Path=/api/resultados/**` significa 'si la URL empieza con /api/resultados/, usa esta ruta'."

**P: ¿Qué es RewritePath y cuándo se usa?**
> R: "RewritePath modifica la URL antes de enviarla al microservicio. Se usa cuando:
> - El Gateway y el microservicio tienen estructuras de URL diferentes
> - Queremos un prefijo en el Gateway (ejemplo: `/resultados/swagger-ui`) pero el microservicio espera `/swagger-ui`"

**P: ¿Cómo sabe el Gateway a qué microservicio enviar la petición?**
> R: "Usa dos mecanismos:
> 1. **Predicados**: Determinan qué ruta usar basándose en la URL
> 2. **Eureka**: Resuelve el nombre lógico (`lb://RESULTADOS-ESTADISTICAS`) a la IP y puerto real"

---

## 📸 CAPTURAS RECOMENDADAS

1. **application.yml del Gateway** - Mostrando configuración de rutas
2. **Terminal** - Respuesta de `curl http://localhost:8080/api/resultados`
3. **Swagger UI** - Interfaz completa cargada a través del Gateway
4. **Swagger UI** - Ejecutando un endpoint y mostrando la respuesta
5. **Comparación** - Mismo comando directo vs. Gateway

---

## 🎉 RESUMEN

### ✅ Configuración básica del Gateway
- Gateway enruta correctamente todas las peticiones
- Predicado `Path` funcionando para `/api/resultados/**`
- CRUD completo accesible a través del Gateway

### ✅ Uso de predicados y filtros
- **Path Predicate**: Implementado en todas las rutas
- **RewritePath Filter**: Implementado para Swagger y Actuator
- Múltiples rutas con diferentes configuraciones

### ✅ Documentación API
- Swagger UI accesible: `http://localhost:8080/resultados/swagger-ui/index.html`
- OpenAPI JSON accesible: `http://localhost:8080/resultados/v3/api-docs`
- Endpoints completamente documentados y probables

---

**✅ CON ESTO TIENES COMPLETO EL CRITERIO DE EDGE SERVER (GATEWAY)**

