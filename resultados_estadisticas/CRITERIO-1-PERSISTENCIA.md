# ✅ CRITERIO 1: PERSISTENCIA DE DATOS

## 📋 Checklist de Verificación

### ✅ Conexión a BD funcional
- [x] La aplicación se conecta correctamente a PostgreSQL
- [x] Los endpoints CRUD retornan datos reales desde la base de datos

### ✅ Repository con consultas implementadas
- [x] **Derived Query**: `findByDepartamentoIgnoreCase`
- [x] **JPQL Query**: `@Query` con consultas personalizadas
- [x] **Native Query**: `@Query(nativeQuery = true)` con SQL nativo

---

## 🗂️ EVIDENCIA 1: Conexión a BD Funcional

### 📁 Archivos de configuración

#### `application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/resultados_db
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

#### `pom.xml` - Dependencias
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 🧪 Prueba de Conexión

1. **Verificar que la base de datos está corriendo:**
   ```bash
   docker ps | grep bd-resultados
   ```

2. **Verificar conexión desde el microservicio:**
   ```bash
   curl http://localhost:8083/resultados
   ```

3. **Resultado esperado:** Lista de todos los `ResultadoMesa` desde la base de datos

---

## 🗂️ EVIDENCIA 2: Endpoints CRUD con Datos Reales

### 📌 Entidad JPA - `ResultadoMesa.java`

La entidad está completamente mapeada con JPA:
```java
@Entity
@Table(name = "resultados_mesa")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoMesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String departamento;
    
    @Column(nullable = false, length = 100)
    private String municipio;
    
    // ... más campos ...
    
    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        this.registradoEn = now;
        this.actualizadoEn = now;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.actualizadoEn = Instant.now();
    }
}
```

### 📌 Endpoints CRUD Implementados

#### 1️⃣ **CREATE** - Crear nuevo resultado
```bash
curl -X POST http://localhost:8083/resultados \
  -H "Content-Type: application/json" \
  -d '{
    "departamento": "Tarija",
    "municipio": "Tarija",
    "recinto": "Escuela Central",
    "mesa": "Mesa 10",
    "inscritos": 400,
    "votosValidosPresencial": 250,
    "votosNulosPresencial": 20,
    "votosBlancosPresencial": 10,
    "votosValidosWeb": 80,
    "votosNulosWeb": 5,
    "votosBlancosWeb": 3
  }'
```

#### 2️⃣ **READ** - Listar todos los resultados
```bash
curl http://localhost:8083/resultados
```

#### 3️⃣ **READ** - Obtener resultado por ID
```bash
curl http://localhost:8083/resultados/1
```

#### 4️⃣ **UPDATE** - Actualizar resultado
```bash
curl -X PUT http://localhost:8083/resultados/1 \
  -H "Content-Type: application/json" \
  -d '{
    "departamento": "La Paz",
    "municipio": "La Paz",
    "recinto": "Coliseo Central ACTUALIZADO",
    "mesa": "Mesa 1",
    "inscritos": 350,
    "votosValidosPresencial": 200,
    "votosNulosPresencial": 15,
    "votosBlancosPresencial": 5,
    "votosValidosWeb": 90,
    "votosNulosWeb": 8,
    "votosBlancosWeb": 6
  }'
```

#### 5️⃣ **DELETE** - Eliminar resultado
```bash
curl -X DELETE http://localhost:8083/resultados/5
```

---

## 🗂️ EVIDENCIA 3: Repository con Consultas

### 📁 Archivo: `ResultadoMesaRepository.java`

```java
@Repository
public interface ResultadoMesaRepository extends JpaRepository<ResultadoMesa, Long> {

    // 1️⃣ DERIVED QUERY
    List<ResultadoMesa> findByDepartamentoIgnoreCase(String departamento);

    // 2️⃣ JPQL QUERY
    @Query("SELECT r FROM ResultadoMesa r WHERE r.inscritos >= :minInscritos")
    List<ResultadoMesa> buscarPorMinimoInscritos(Long minInscritos);

    @Query("SELECT r.departamento as departamento, SUM(r.inscritos) as totalInscritos " +
           "FROM ResultadoMesa r GROUP BY r.departamento")
    List<Map<String, Object>> sumarInscritosPorDepartamento();

    // 3️⃣ NATIVE QUERY
    @Query(value = "SELECT municipio, COUNT(id) FROM resultados_mesa " +
                   "WHERE votos_validos_presencial >= :minVotosValidos " +
                   "GROUP BY municipio", 
           nativeQuery = true)
    List<Object[]> contarMesasPorMunicipio(Long minVotosValidos);

    @Query(value = "SELECT * FROM resultados_mesa " +
                   "WHERE (votos_validos_presencial + votos_validos_web) >= :minVotosValidos", 
           nativeQuery = true)
    List<ResultadoMesa> buscarPorVotosValidosMinimos(Long minVotosValidos);
}
```

---

## 🧪 PRUEBAS DE CONSULTAS

### 1️⃣ Derived Query - Buscar por departamento
```bash
curl http://localhost:8083/resultados/departamento/La%20Paz
```

**Explicación:** 
- Spring Data JPA genera automáticamente la consulta SQL a partir del nombre del método
- `findByDepartamentoIgnoreCase` → `SELECT * FROM resultados_mesa WHERE UPPER(departamento) = UPPER(?)`

**Resultado esperado:** Todos los resultados del departamento "La Paz"

---

### 2️⃣ JPQL Query - Buscar por mínimo de inscritos
```bash
curl http://localhost:8083/resultados/inscritos-minimo/300
```

**Explicación:**
- JPQL usa el modelo de objetos (entidades) en lugar de tablas
- `FROM ResultadoMesa r` hace referencia a la clase Java, no a la tabla SQL

**Resultado esperado:** Resultados con 300 o más inscritos

---

### 3️⃣ JPQL Query - Sumar inscritos por departamento
```bash
curl http://localhost:8083/resultados/sumar-inscritos-por-departamento
```

**Explicación:**
- Esta consulta agrupa y suma datos usando JPQL
- Retorna un `Map<String, Object>` con el departamento y el total

**Resultado esperado:** 
```json
[
  {"departamento": "La Paz", "totalInscritos": 600},
  {"departamento": "Santa Cruz", "totalInscritos": 600},
  {"departamento": "Cochabamba", "totalInscritos": 280}
]
```

---

### 4️⃣ Native Query - Contar mesas por municipio
```bash
curl http://localhost:8083/resultados/conteo-por-municipio/200
```

**Explicación:**
- Esta consulta usa SQL nativo (PostgreSQL)
- Usa los nombres de columnas de la tabla (`votos_validos_presencial`)
- Retorna un `Object[]` con los resultados

**Resultado esperado:**
```json
[
  ["Santa Cruz de la Sierra", 1],
  ["La Paz", 1]
]
```

---

### 5️⃣ Native Query - Buscar por votos válidos mínimos
```bash
curl http://localhost:8083/resultados/votos-validos-minimo/200
```

**Explicación:**
- Usa SQL nativo para sumar votos presenciales y web
- Retorna entidades completas de `ResultadoMesa`

**Resultado esperado:** Resultados con la suma de votos válidos >= 200

---

## 📊 DEMOSTRACIÓN EN SWAGGER UI

Accede a: **http://localhost:8083/swagger-ui/index.html**

En Swagger puedes:
1. Ver todos los endpoints documentados
2. Probar cada consulta directamente desde el navegador
3. Ver los modelos de datos y respuestas

---

## 🎯 VERIFICACIÓN FINAL

### ✅ Checklist de demostración

1. **Base de datos funcional**
   - [ ] PostgreSQL corriendo en Docker
   - [ ] Microservicio conectado a PostgreSQL
   - [ ] Tabla `resultados_mesa` creada automáticamente

2. **CRUD completo**
   - [ ] CREATE: Crear nuevo resultado
   - [ ] READ: Listar todos y obtener por ID
   - [ ] UPDATE: Actualizar resultado existente
   - [ ] DELETE: Eliminar resultado

3. **Consultas del Repository**
   - [ ] **Derived Query**: Buscar por departamento
   - [ ] **JPQL Query**: Buscar por inscritos, sumar por departamento
   - [ ] **Native Query**: Contar mesas, buscar por votos válidos

4. **Evidencia en código fuente**
   - [ ] `ResultadoMesa.java` con anotaciones JPA
   - [ ] `ResultadoMesaRepository.java` con las 3 tipos de consultas
   - [ ] `ResultadosService.java` usando el repositorio
   - [ ] `ResultadosController.java` exponiendo los endpoints

---

## 🚀 COMANDOS RÁPIDOS PARA LA DEMO

```bash
# 1. Listar todos los resultados
curl http://localhost:8083/resultados

# 2. Buscar por departamento (Derived Query)
curl http://localhost:8083/resultados/departamento/La%20Paz

# 3. Buscar por inscritos mínimos (JPQL)
curl http://localhost:8083/resultados/inscritos-minimo/300

# 4. Buscar por votos válidos (Native Query)
curl http://localhost:8083/resultados/votos-validos-minimo/200

# 5. Crear nuevo resultado
curl -X POST http://localhost:8083/resultados -H "Content-Type: application/json" -d '{"departamento":"Pando","municipio":"Cobija","recinto":"Escuela Norte","mesa":"Mesa 20","inscritos":150,"votosValidosPresencial":100,"votosNulosPresencial":5,"votosBlancosPresencial":2,"votosValidosWeb":30,"votosNulosWeb":3,"votosBlancosWeb":1}'

# 6. Actualizar resultado
curl -X PUT http://localhost:8083/resultados/1 -H "Content-Type: application/json" -d '{"departamento":"La Paz","municipio":"La Paz","recinto":"Coliseo Central MODIFICADO","mesa":"Mesa 1","inscritos":400,"votosValidosPresencial":250,"votosNulosPresencial":20,"votosBlancosPresencial":8,"votosValidosWeb":100,"votosNulosWeb":10,"votosBlancosWeb":5}'
```

---

## 📸 CAPTURAS DE PANTALLA RECOMENDADAS

1. Terminal mostrando `docker ps` con `bd-resultados` y `ms-resultados`
2. Respuesta JSON de `GET /resultados` mostrando datos de la BD
3. Código fuente de `ResultadoMesaRepository.java` con las 3 consultas
4. Swagger UI con los endpoints documentados
5. Base de datos PostgreSQL con la tabla `resultados_mesa` y registros

---

**✅ CON ESTO TIENES COMPLETO EL CRITERIO DE PERSISTENCIA DE DATOS**
