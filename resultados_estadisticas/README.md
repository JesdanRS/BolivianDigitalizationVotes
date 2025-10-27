# 🗳️ Microservicio: Resultados y Estadísticas

Microservicio para gestionar resultados de votación por mesa y generar estadísticas.

## 🚀 Inicio Rápido

### 1. Levantar los servicios con Docker
```bash
# Desde la raíz del proyecto
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas
```

### 2. Verificar que esté funcionando
```bash
# Listar resultados
curl http://localhost:8083/resultados

# Ver Swagger UI
# Abrir en el navegador: http://localhost:8083/swagger-ui/index.html
```

## 📊 Criterios de Evaluación Implementados

### ✅ 1. Persistencia de Datos
- ✅ Conexión a PostgreSQL funcional
- ✅ Endpoints CRUD con datos reales
- ✅ Repository con:
  - **Derived Query**: `findByDepartamentoIgnoreCase`
  - **JPQL Query**: Consultas con `@Query`
  - **Native Query**: Consultas SQL nativas

📄 **Documentación detallada**: Ver [`CRITERIO-1-PERSISTENCIA.md`](./CRITERIO-1-PERSISTENCIA.md)

---

## 📁 Estructura del Proyecto

```
resultados_estadisticas/
├── src/main/java/com/votaciones/resultados_estadisticas/
│   ├── model/
│   │   └── ResultadoMesa.java         # Entidad JPA
│   ├── repository/
│   │   └── ResultadoMesaRepository.java  # Derived, JPQL, Native Queries
│   ├── service/
│   │   └── ResultadosService.java     # Lógica de negocio
│   ├── controller/
│   │   └── ResultadosController.java  # Endpoints REST
│   ├── dto/
│   │   └── EstadisticaDto.java        # DTO para estadísticas
│   ├── exception/
│   │   ├── RecursoNoEncontradoException.java
│   │   └── SolicitudInvalidaException.java
│   └── config/
│       └── SecurityConfig.java        # Configuración de seguridad
└── src/main/resources/
    └── application.properties         # Configuración
```

---

## 🔌 Endpoints Principales

### CRUD Básico
- `GET /resultados` - Listar todos
- `GET /resultados/{id}` - Obtener por ID
- `POST /resultados` - Crear nuevo
- `PUT /resultados/{id}` - Actualizar
- `DELETE /resultados/{id}` - Eliminar

### Consultas Personalizadas
- `GET /resultados/departamento/{departamento}` - Derived Query
- `GET /resultados/inscritos-minimo/{min}` - JPQL Query
- `GET /resultados/votos-validos-minimo/{min}` - Native Query
- `GET /resultados/sumar-inscritos-por-departamento` - JPQL Query
- `GET /resultados/conteo-por-municipio/{min}` - Native Query

### Estadísticas
- `GET /resultados/estadisticas` - Estadísticas por departamento
- `GET /resultados/estadisticas/{departamento}` - Estadística de un departamento

---

## 🗄️ Base de Datos

**PostgreSQL** en Docker:
- **Host**: `localhost`
- **Puerto**: `5434` (externo), `5432` (interno)
- **Database**: `resultados_db`
- **Usuario**: `postgres`
- **Password**: `password`

### Conectarse a la BD desde terminal:
```bash
docker exec -it bd-resultados psql -U postgres -d resultados_db
```

### Consultas SQL útiles:
```sql
-- Ver todos los resultados
SELECT * FROM resultados_mesa;

-- Contar registros
SELECT COUNT(*) FROM resultados_mesa;

-- Ver resultados de un departamento
SELECT * FROM resultados_mesa WHERE departamento = 'La Paz';
```

---

## 🧪 Pruebas Rápidas

```bash
# 1. Listar todos
curl http://localhost:8083/resultados

# 2. Derived Query - Buscar por departamento
curl http://localhost:8083/resultados/departamento/La%20Paz

# 3. JPQL Query - Mínimo de inscritos
curl http://localhost:8083/resultados/inscritos-minimo/300

# 4. Native Query - Votos válidos mínimos
curl http://localhost:8083/resultados/votos-validos-minimo/200

# 5. Crear nuevo resultado
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

---

## 🛠️ Tecnologías Utilizadas

- **Spring Boot 3.3.5**
- **Spring Data JPA**
- **PostgreSQL 16**
- **Spring Cloud (Eureka Client)**
- **Springdoc OpenAPI** (Swagger)
- **Lombok**
- **Docker & Docker Compose**

---

## 📚 Documentación Adicional

- [`CRITERIO-1-PERSISTENCIA.md`](./CRITERIO-1-PERSISTENCIA.md) - Guía detallada del criterio de persistencia
- [`datos-ejemplo.sql`](./datos-ejemplo.sql) - Script SQL con datos de ejemplo
- Swagger UI: http://localhost:8083/swagger-ui/index.html

---

## 🔧 Comandos de Desarrollo

```bash
# Compilar sin Docker
./mvnw clean package

# Ejecutar localmente
./mvnw spring-boot:run

# Ver logs de Docker
docker compose logs -f resultados-estadisticas

# Reconstruir imagen de Docker
docker compose build resultados-estadisticas --no-cache

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (reiniciar BD)
docker compose down -v
```

---

## 📞 Puerto y Servicios

- **Microservicio**: `http://localhost:8083`
- **Swagger UI**: `http://localhost:8083/swagger-ui/index.html`
- **Actuator**: `http://localhost:8083/actuator`
- **Eureka Dashboard**: `http://localhost:8761`
- **PostgreSQL**: `localhost:5434`

---

## ✅ Checklist de Verificación

- [ ] PostgreSQL corriendo en Docker
- [ ] Microservicio registrado en Eureka
- [ ] Tabla `resultados_mesa` creada automáticamente
- [ ] Datos de ejemplo cargados
- [ ] CRUD funcional
- [ ] Derived Queries funcionando
- [ ] JPQL Queries funcionando
- [ ] Native Queries funcionando
- [ ] Swagger UI accesible
