# 🎯 LISTO PARA DEMOSTRACIÓN

## ✅ CRITERIO 1: PERSISTENCIA DE DATOS - COMPLETADO

---

## 🚀 INICIO RÁPIDO (3 pasos)

### 1. Levantar servicios
```bash
docker compose up -d eureka-server postgres-db-resultados resultados-estadisticas
```

### 2. Esperar ~15 segundos y verificar
```bash
curl http://localhost:8083/resultados
```

### 3. Abrir Swagger UI
```
http://localhost:8083/swagger-ui/index.html
```

---

## 📋 DEMOSTRACIÓN COMPLETA DEL CRITERIO

### ✅ PUNTO 1: Conexión a BD funcional

**Evidencia 1: Configuración**
```bash
# Mostrar archivo de configuración
cat resultados_estadisticas/src/main/resources/application.properties | grep -A 5 "datasource"
```

**Evidencia 2: Endpoint retorna datos reales**
```bash
# Este comando debe retornar JSON con datos desde PostgreSQL
curl http://localhost:8083/resultados
```

**Explicación para la docente:**
> "El microservicio se conecta a PostgreSQL en Docker. La configuración está en `application.properties` y los datos que se ven en pantalla vienen directamente de la base de datos, no son datos en memoria."

---

### ✅ PUNTO 2: Repository con consultas implementadas

**Mostrar código fuente del Repository:**
```bash
cat resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/repository/ResultadoMesaRepository.java
```

---

#### 🔹 Derived Query

**Código:**
```java
List<ResultadoMesa> findByDepartamentoIgnoreCase(String departamento);
```

**Prueba:**
```bash
curl http://localhost:8083/resultados/departamento/La%20Paz
```

**Explicación:**
> "Spring Data JPA genera automáticamente la consulta SQL a partir del nombre del método. `findByDepartamentoIgnoreCase` busca resultados donde el departamento coincida, ignorando mayúsculas y minúsculas."

---

#### 🔹 JPQL Query

**Código:**
```java
@Query("SELECT r FROM ResultadoMesa r WHERE r.inscritos >= :minInscritos")
List<ResultadoMesa> buscarPorMinimoInscritos(Long minInscritos);
```

**Prueba:**
```bash
curl http://localhost:8083/resultados/inscritos-minimo/300
```

**Explicación:**
> "JPQL (Java Persistence Query Language) trabaja con entidades Java, no con tablas SQL. `FROM ResultadoMesa r` hace referencia a la clase Java, no a la tabla `resultados_mesa`. Spring traduce esto a SQL."

---

#### 🔹 JPQL Query con Agregación

**Código:**
```java
@Query("SELECT r.departamento as departamento, SUM(r.inscritos) as totalInscritos " +
       "FROM ResultadoMesa r GROUP BY r.departamento")
List<Map<String, Object>> sumarInscritosPorDepartamento();
```

**Prueba:**
```bash
curl http://localhost:8083/resultados/sumar-inscritos-por-departamento
```

**Explicación:**
> "Esta consulta JPQL agrupa los resultados por departamento y suma el total de inscritos de cada uno."

---

#### 🔹 Native Query

**Código:**
```java
@Query(value = "SELECT * FROM resultados_mesa " +
               "WHERE (votos_validos_presencial + votos_validos_web) >= :minVotosValidos", 
       nativeQuery = true)
List<ResultadoMesa> buscarPorVotosValidosMinimos(Long minVotosValidos);
```

**Prueba:**
```bash
curl http://localhost:8083/resultados/votos-validos-minimo/200
```

**Explicación:**
> "Native Query usa SQL directo de PostgreSQL. Aquí usamos los nombres de columnas de la tabla (`votos_validos_presencial`) en lugar de los nombres de atributos Java. Es útil para consultas complejas o específicas de la base de datos."

---

#### 🔹 Native Query con COUNT y GROUP BY

**Código:**
```java
@Query(value = "SELECT municipio, COUNT(id) FROM resultados_mesa " +
               "WHERE votos_validos_presencial >= :minVotosValidos " +
               "GROUP BY municipio", 
       nativeQuery = true)
List<Object[]> contarMesasPorMunicipio(Long minVotosValidos);
```

**Prueba:**
```bash
curl http://localhost:8083/resultados/conteo-por-municipio/200
```

**Explicación:**
> "Esta native query cuenta cuántas mesas hay en cada municipio que tengan un mínimo de votos válidos presenciales. Retorna un array de objetos porque no es una entidad completa."

---

## 🗂️ ARCHIVOS PARA MOSTRAR

### 1. Modelo de Datos
```bash
code resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/model/ResultadoMesa.java
```

**Puntos clave:**
- `@Entity` y `@Table` → Mapeo JPA
- `@Id` y `@GeneratedValue` → Primary Key
- `@Column` → Configuración de columnas
- `@PrePersist` y `@PreUpdate` → Timestamps automáticos

---

### 2. Repository
```bash
code resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/repository/ResultadoMesaRepository.java
```

**Puntos clave:**
- Extiende `JpaRepository` → CRUD automático
- 1 Derived Query
- 2 JPQL Queries
- 2 Native Queries

---

### 3. Service
```bash
code resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/service/ResultadosService.java
```

**Puntos clave:**
- Inyección de `ResultadoMesaRepository`
- Métodos CRUD
- Métodos que usan las consultas personalizadas
- `@Transactional`

---

### 4. Controller
```bash
code resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/controller/ResultadosController.java
```

**Puntos clave:**
- Endpoints REST
- Documentación con Swagger
- Validación con `@Valid`

---

### 5. Configuración
```bash
code resultados_estadisticas/src/main/resources/application.properties
```

**Puntos clave:**
- Conexión a PostgreSQL
- JPA/Hibernate configuration
- Eureka client

---

### 6. Dockerfile
```bash
code resultados_estadisticas/Dockerfile
```

**Puntos clave:**
- Multi-stage build
- Maven compilation
- OpenJDK runtime

---

### 7. Docker Compose
```bash
code docker-compose.yml | grep -A 15 "postgres-db-resultados"
code docker-compose.yml | grep -A 10 "resultados-estadisticas:"
```

---

## 🗄️ ACCESO A LA BASE DE DATOS

```bash
# Conectarse a PostgreSQL
docker exec -it bd-resultados psql -U postgres -d resultados_db

# Ver la tabla
\d resultados_mesa

# Ver datos
SELECT * FROM resultados_mesa LIMIT 5;

# Contar registros
SELECT COUNT(*) FROM resultados_mesa;
```

---

## 📊 SWAGGER UI

Abrir en navegador: **http://localhost:8083/swagger-ui/index.html**

**Demostrar:**
1. Sección "resultados-controller"
2. Expandir cada endpoint
3. Mostrar modelos de datos
4. Ejecutar algunos endpoints desde Swagger

---

## 🎯 SECUENCIA DE DEMOSTRACIÓN RECOMENDADA

### 1. Mostrar que los servicios están corriendo (30 seg)
```bash
docker ps | grep -E "(eureka|bd-resultados|ms-resultados)"
```

### 2. Probar conexión a BD (30 seg)
```bash
curl http://localhost:8083/resultados
```

### 3. Mostrar código del Repository (1 min)
```bash
code resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/repository/ResultadoMesaRepository.java
```

### 4. Ejecutar Derived Query (30 seg)
```bash
curl http://localhost:8083/resultados/departamento/La%20Paz
```

### 5. Ejecutar JPQL Query (30 seg)
```bash
curl http://localhost:8083/resultados/inscritos-minimo/300
```

### 6. Ejecutar Native Query (30 seg)
```bash
curl http://localhost:8083/resultados/votos-validos-minimo/200
```

### 7. Mostrar entidad JPA (1 min)
```bash
code resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/model/ResultadoMesa.java
```

### 8. Mostrar Swagger UI (1 min)
Abrir: http://localhost:8083/swagger-ui/index.html

### 9. OPCIONAL: Acceder a la BD (1 min)
```bash
docker exec -it bd-resultados psql -U postgres -d resultados_db -c "SELECT departamento, COUNT(*) FROM resultados_mesa GROUP BY departamento;"
```

---

## 📋 CHECKLIST FINAL

### Antes de la demostración:
- [ ] Docker Desktop corriendo
- [ ] Servicios levantados (`docker compose up -d`)
- [ ] Verificado que el endpoint responde
- [ ] VS Code abierto con el proyecto
- [ ] Navegador con Swagger UI listo
- [ ] Terminal lista con los comandos

### Durante la demostración:
- [ ] Mostrar que los servicios están corriendo
- [ ] Ejecutar endpoint que retorna datos desde BD
- [ ] Mostrar código del Repository
- [ ] Ejecutar Derived Query
- [ ] Ejecutar JPQL Query
- [ ] Ejecutar Native Query
- [ ] Mostrar entidad con anotaciones JPA
- [ ] Mostrar Swagger UI

---

## 💡 RESPUESTAS A POSIBLES PREGUNTAS

**P: ¿Por qué usas Derived Query?**
> R: "Es la forma más simple de crear consultas en Spring Data JPA. Solo con el nombre del método, Spring genera automáticamente el SQL. Es útil para consultas básicas."

**P: ¿Cuál es la diferencia entre JPQL y Native Query?**
> R: "JPQL trabaja con entidades Java (orientado a objetos), mientras que Native Query usa SQL directo de la base de datos. JPQL es independiente de la BD, pero Native Query permite usar características específicas de PostgreSQL."

**P: ¿Dónde se crean las tablas?**
> R: "Hibernate las crea automáticamente al iniciar el microservicio gracias a `spring.jpa.hibernate.ddl-auto=update`. La estructura viene de las anotaciones JPA en la entidad `ResultadoMesa`."

**P: ¿Cómo sabe Spring qué consultas ejecutar?**
> R: "El Repository es una interfaz que extiende `JpaRepository`. Spring Data JPA crea automáticamente la implementación en tiempo de ejecución, generando el código SQL correspondiente."

---

## 🎉 RESUMEN

✅ **Conexión a BD**: PostgreSQL en Docker, configurado en `application.properties`  
✅ **CRUD funcional**: Endpoints retornan datos reales desde la BD  
✅ **Derived Query**: `findByDepartamentoIgnoreCase`  
✅ **JPQL Queries**: 2 consultas con `@Query`  
✅ **Native Queries**: 2 consultas con `nativeQuery = true`  

**Código fuente completo en:**
- `ResultadoMesa.java` (modelo)
- `ResultadoMesaRepository.java` (consultas)
- `ResultadosService.java` (lógica)
- `ResultadosController.java` (endpoints)

---

## 📚 DOCUMENTACIÓN ADICIONAL

- [`CRITERIO-1-PERSISTENCIA.md`](./CRITERIO-1-PERSISTENCIA.md) - Guía detallada
- [`COMANDOS-PRUEBA.md`](./COMANDOS-PRUEBA.md) - Todos los comandos
- [`README.md`](./README.md) - Documentación general
- [`RESUMEN-IMPLEMENTACION.md`](./RESUMEN-IMPLEMENTACION.md) - Resumen técnico

---

**🎯 TODO LISTO PARA LA DEMOSTRACIÓN ✅**
