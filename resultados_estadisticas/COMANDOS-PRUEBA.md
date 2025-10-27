# 🧪 COMANDOS DE PRUEBA - Resultados y Estadísticas

## 🚀 Inicio

```bash
# Levantar servicios
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas

# Ver logs
docker compose logs -f resultados-estadisticas

# Verificar estado
docker ps | grep -E "(eureka|bd-resultados|ms-resultados)"
```

---

## 📋 CRUD Básico

### 1️⃣ Listar todos los resultados
```bash
curl http://localhost:8083/resultados
```

### 2️⃣ Obtener un resultado por ID
```bash
curl http://localhost:8083/resultados/1
```

### 3️⃣ Crear nuevo resultado
```bash
curl -X POST http://localhost:8083/resultados \
  -H "Content-Type: application/json" \
  -d '{
    "departamento": "Oruro",
    "municipio": "Oruro",
    "recinto": "Colegio Nacional",
    "mesa": "Mesa 15",
    "inscritos": 200,
    "votosValidosPresencial": 120,
    "votosNulosPresencial": 8,
    "votosBlancosPresencial": 3,
    "votosValidosWeb": 50,
    "votosNulosWeb": 4,
    "votosBlancosWeb": 2
  }'
```

### 4️⃣ Actualizar resultado existente
```bash
curl -X PUT http://localhost:8083/resultados/1 \
  -H "Content-Type: application/json" \
  -d '{
    "departamento": "La Paz",
    "municipio": "La Paz",
    "recinto": "Coliseo Central MODIFICADO",
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

### 5️⃣ Eliminar resultado
```bash
curl -X DELETE http://localhost:8083/resultados/5
```

---

## 🔍 Derived Query

```bash
# Buscar por departamento
curl http://localhost:8083/resultados/departamento/La%20Paz

# Buscar por departamento (minúsculas - también funciona)
curl http://localhost:8083/resultados/departamento/la%20paz

# Buscar por otro departamento
curl http://localhost:8083/resultados/departamento/Santa%20Cruz
```

---

## 📊 JPQL Queries

```bash
# Buscar por mínimo de inscritos
curl http://localhost:8083/resultados/inscritos-minimo/300

# Buscar con menos inscritos
curl http://localhost:8083/resultados/inscritos-minimo/250

# Sumar inscritos por departamento
curl http://localhost:8083/resultados/sumar-inscritos-por-departamento
```

---

## 💾 Native Queries

```bash
# Contar mesas por municipio con mínimo de votos válidos presenciales
curl http://localhost:8083/resultados/conteo-por-municipio/200

# Con un mínimo más bajo
curl http://localhost:8083/resultados/conteo-por-municipio/100

# Buscar por votos válidos mínimos (presencial + web)
curl http://localhost:8083/resultados/votos-validos-minimo/200

# Con un mínimo más alto
curl http://localhost:8083/resultados/votos-validos-minimo/300
```

---

## 📈 Estadísticas

```bash
# Estadísticas de todos los departamentos
curl http://localhost:8083/resultados/estadisticas

# Estadísticas por canal presencial
curl "http://localhost:8083/resultados/estadisticas?canal=presencial"

# Estadísticas por canal web
curl "http://localhost:8083/resultados/estadisticas?canal=web"

# Estadística de un departamento específico
curl http://localhost:8083/resultados/estadisticas/La%20Paz

# Estadística de un departamento por canal
curl "http://localhost:8083/resultados/estadisticas/Santa%20Cruz?canal=presencial"
```

---

## 🗄️ Acceso a la Base de Datos

```bash
# Conectarse a PostgreSQL
docker exec -it bd-resultados psql -U postgres -d resultados_db

# Dentro de psql:
# Ver todas las tablas
\dt

# Ver estructura de la tabla
\d resultados_mesa

# Consultar datos
SELECT * FROM resultados_mesa;

# Contar registros
SELECT COUNT(*) FROM resultados_mesa;

# Resultados por departamento
SELECT departamento, COUNT(*) FROM resultados_mesa GROUP BY departamento;

# Salir
\q
```

---

## 🌐 Swagger UI

Abrir en el navegador:
```
http://localhost:8083/swagger-ui/index.html
```

---

## 🎯 Prueba Completa del Criterio 1

```bash
# 1. Verificar conexión a BD (debe retornar datos)
curl http://localhost:8083/resultados

# 2. Verificar Derived Query
curl http://localhost:8083/resultados/departamento/La%20Paz

# 3. Verificar JPQL Query
curl http://localhost:8083/resultados/inscritos-minimo/300

# 4. Verificar Native Query
curl http://localhost:8083/resultados/votos-validos-minimo/200

# 5. Verificar CRUD - Crear
curl -X POST http://localhost:8083/resultados \
  -H "Content-Type: application/json" \
  -d '{"departamento":"Test","municipio":"Test","recinto":"Test","mesa":"Test","inscritos":100,"votosValidosPresencial":50,"votosNulosPresencial":5,"votosBlancosPresencial":2,"votosValidosWeb":30,"votosNulosWeb":3,"votosBlancosWeb":1}'

# 6. Verificar CRUD - Actualizar (usar ID del resultado creado)
curl -X PUT http://localhost:8083/resultados/5 \
  -H "Content-Type: application/json" \
  -d '{"departamento":"Test MODIFICADO","municipio":"Test","recinto":"Test","mesa":"Test","inscritos":150,"votosValidosPresencial":80,"votosNulosPresencial":8,"votosBlancosPresencial":3,"votosValidosWeb":40,"votosNulosWeb":4,"votosBlancosWeb":2}'

# 7. Verificar CRUD - Eliminar
curl -X DELETE http://localhost:8083/resultados/5
```

---

## 🔄 Reiniciar Todo

```bash
# Detener servicios
docker compose down

# Detener y eliminar volúmenes (reinicia BD)
docker compose down -v

# Levantar de nuevo
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas
```

---

## 📊 Verificación en Eureka

```
http://localhost:8761
```

Debe aparecer: **RESULTADOS-ESTADISTICAS** registrado

---

## ✅ Checklist de Prueba

- [ ] Servicios corriendo (Eureka, PostgreSQL, Microservicio)
- [ ] GET `/resultados` retorna datos
- [ ] POST `/resultados` crea nuevo registro
- [ ] PUT `/resultados/{id}` actualiza registro
- [ ] DELETE `/resultados/{id}` elimina registro
- [ ] GET `/resultados/departamento/{dep}` (Derived Query) funciona
- [ ] GET `/resultados/inscritos-minimo/{min}` (JPQL) funciona
- [ ] GET `/resultados/votos-validos-minimo/{min}` (Native) funciona
- [ ] Swagger UI accesible
- [ ] Microservicio registrado en Eureka
