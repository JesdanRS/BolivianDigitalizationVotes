# 🐳 Guía de Despliegue con Docker

Este documento explica cómo levantar toda la arquitectura de microservicios usando Docker Compose.

## 📋 Prerequisitos

- Docker Desktop instalado
- Docker Compose instalado
- Puerto 8080, 8761, 8085, 5432 y 5435 disponibles

## 🚀 Comandos para levantar el sistema

### 1. Compilar e iniciar todos los servicios

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de todos los microservicios
- Inicia las bases de datos PostgreSQL
- Levanta Eureka Server
- Inicia los microservicios
- Levanta el API Gateway

### 2. Ver logs de todos los servicios

```bash
docker-compose logs -f
```

### 3. Ver logs de un servicio específico

```bash
docker-compose logs -f eureka-server
docker-compose logs -f api-gateway
docker-compose logs -f ms-auditoria
```

### 4. Verificar estado de los contenedores

```bash
docker-compose ps
```

## 🔍 Verificación del sistema

### 1. Eureka Dashboard
```
http://localhost:8761
```
Deberías ver:
- `API-GATEWAY` - UP
- `AUDITORIA-REGISTROS-SERVICE` - UP

### 2. API Gateway (Swagger)
```
http://localhost:8080/swagger-ui.html
```

### 3. Endpoint de auditoría a través del Gateway
```
GET http://localhost:8080/api/auditoria/eventos
```

### 4. Crear evento de auditoría
```bash
curl -X POST http://localhost:8080/api/auditoria \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "LOGIN",
    "severidad": "INFO",
    "modulo": "usuarios",
    "usuario": "9876542",
    "ip": "192.168.0.12",
    "correlacion": "USR-2025-10-24-01",
    "detalle": "Inicio de sesión exitoso"
  }'
```

## 🛑 Detener el sistema

### Detener todos los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (limpieza completa)
```bash
docker-compose down -v
```

## 🔧 Solución de problemas

### Problema: Servicio no se registra en Eureka
**Solución:** Espera 30-60 segundos después de iniciar. Eureka necesita tiempo para descubrir servicios.

### Problema: Error de conexión a base de datos
**Solución:** Verifica que los healthchecks de PostgreSQL estén pasando:
```bash
docker-compose ps
```

### Problema: Puerto en uso
**Solución:** 
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

## 📊 Orden de inicio

El sistema se inicia en el siguiente orden (gestionado automáticamente por `depends_on`):

1. **Bases de datos** (postgres-db-usuarios, postgres-db-auditoria)
2. **Eureka Server** (esperando healthcheck)
3. **Microservicios** (usuarios-service, auditoria-service)
4. **API Gateway** (esperando Eureka y microservicios)

## 🏗️ Arquitectura

```
┌─────────────────┐
│   API Gateway   │ :8080
│   (WebFlux)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────────────┐
│Eureka│  │   Auditoría   │ :8085
│:8761 │  │   Service     │
└──────┘  └───────┬───────┘
                  │
           ┌──────▼──────┐
           │ PostgreSQL  │ :5435
           │  auditoria  │
           └─────────────┘
```

## 📦 Volúmenes persistentes

Los datos se persisten en volúmenes Docker:
- `db-data-usuarios` - Base de datos de usuarios
- `db-data-auditoria` - Base de datos de auditoría

Para hacer backup:
```bash
docker run --rm -v db-data-auditoria:/data -v $(pwd):/backup ubuntu tar cvf /backup/auditoria-backup.tar /data
```

## ✅ Checklist de verificación

- [ ] Eureka Dashboard muestra todos los servicios
- [ ] Gateway responde en puerto 8080
- [ ] Swagger UI accesible
- [ ] Endpoints funcionan a través del Gateway
- [ ] `docker-compose ps` muestra todos los servicios como "healthy"
- [ ] Logs no muestran errores críticos
