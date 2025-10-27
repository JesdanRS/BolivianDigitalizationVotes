# ✅ CRITERIO 2: EUREKA SERVER (DISCOVERY)

## 📋 Checklist de Verificación

### ✅ Registro de Eureka Server
- [x] El servidor Eureka levanta correctamente
- [x] Dashboard de Eureka accesible

### ✅ Registro de microservicios
- [x] Los servicios se registran en Eureka
- [x] Se observan instancias registradas

### ✅ Descubrimiento dinámico
- [x] Los microservicios se comunican por nombre lógico, no por IP fija
- [x] Peticiones entre servicios se resuelven con nombres del registry

---

## 🗂️ EVIDENCIA 1: Registro de Eureka Server

### 📁 Configuración del Eureka Server

#### `eureka-server/pom.xml` - Dependencias
```xml
<properties>
    <java.version>21</java.version>
    <spring-cloud.version>2023.0.1</spring-cloud.version>
</properties>

<dependencies>
    <!-- La única dependencia funcional que necesitas: Eureka Server -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

#### `eureka-server/src/main/resources/application.yml`
```yaml
server:
  port: 8761  # Puerto estándar de Eureka

spring:
  application:
    name: eureka-server

eureka:
  client:
    # Un servidor Eureka no necesita registrarse consigo mismo
    register-with-eureka: false
    # No necesita obtener el registro de otros servidores
    fetch-registry: false
```

### 🧪 Prueba: Acceso al Dashboard de Eureka

**URL del Dashboard:**
```
http://localhost:8761
```

**Verificar que el servidor está corriendo:**
```bash
docker ps | grep eureka
```

**Resultado esperado:**
```
CONTAINER ID   IMAGE                                     COMMAND                CREATED        STATUS
9921f7c0cba1   eureka-server                             "java -jar app.jar"    X min ago      Up X min
```

**Abrir el Dashboard en el navegador:**
- URL: http://localhost:8761
- Debe mostrar la interfaz web de Eureka Server
- Sección "Instances currently registered with Eureka" debe listar los microservicios

---

## 🗂️ EVIDENCIA 2: Registro de microservicios

### 📁 Configuración del Cliente Eureka en `resultados_estadisticas`

#### `resultados_estadisticas/pom.xml` - Dependencia Eureka Client
```xml
<properties>
    <spring-cloud.version>2023.0.1</spring-cloud.version>
</properties>

<dependencies>
    <!-- Eureka Client -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    
    <!-- Actuator (necesario para health checks) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

#### `resultados_estadisticas/src/main/resources/application.properties`
```properties
# Nombre de la aplicación (usado como ID en Eureka)
spring.application.name=resultados-estadisticas

# Puerto del microservicio
server.port=8083

# Configuración de Eureka Client
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
eureka.instance.prefer-ip-address=true

# Actuator para health checks
management.endpoints.web.exposure.include=*
```

**Explicación:**
- `spring.application.name`: Nombre con el que se registra el servicio en Eureka
- `eureka.client.service-url.defaultZone`: URL del servidor Eureka
- `eureka.instance.prefer-ip-address=true`: Usa la IP en lugar del hostname

#### `ResultadosEstadisticasApplication.java` - Aplicación Principal
```java
package com.votaciones.resultados_estadisticas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // Incluye @EnableDiscoveryClient automáticamente
public class ResultadosEstadisticasApplication {
    public static void main(String[] args) {
        SpringApplication.run(ResultadosEstadisticasApplication.class, args);
    }
}
```

**Nota:** Desde Spring Cloud 3.x, no es necesario usar `@EnableDiscoveryClient` explícitamente. Spring Boot lo habilita automáticamente si detecta la dependencia de Eureka Client en el classpath.

### 🧪 Prueba: Verificar Registro en Eureka

#### 1. Verificar que el microservicio está corriendo
```bash
docker ps | grep ms-resultados
```

#### 2. Verificar logs del microservicio
```bash
docker compose logs resultados-estadisticas | grep -i "eureka"
```

**Resultado esperado en los logs:**
```
DiscoveryClient_RESULTADOS-ESTADISTICAS/... - registration status: 204
Registered with Eureka server...
```

#### 3. Verificar en el Dashboard de Eureka
Abrir: http://localhost:8761

**En la sección "Instances currently registered with Eureka"** debe aparecer:

```
Application            AMIs        Availability Zones    Status
RESULTADOS-ESTADISTICAS  n/a (1)     (1)                  UP (1) - ...
```

#### 4. Consultar el API de Eureka
```bash
curl http://localhost:8761/eureka/apps
```

**Debe incluir:**
```xml
<application>
    <name>RESULTADOS-ESTADISTICAS</name>
    <instance>
        <instanceId>...</instanceId>
        <hostName>...</hostName>
        <app>RESULTADOS-ESTADISTICAS</app>
        <ipAddr>...</ipAddr>
        <status>UP</status>
        <port enabled="true">8083</port>
        ...
    </instance>
</application>
```

#### 5. Consultar en formato JSON
```bash
curl -H "Accept: application/json" http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS
```

---

## 🗂️ EVIDENCIA 3: Descubrimiento dinámico

### 📌 Concepto de Descubrimiento Dinámico

**Sin Eureka (IP fija):**
```java
String url = "http://192.168.1.100:8083/resultados";  // ❌ IP hardcodeada
```

**Con Eureka (nombre lógico):**
```java
String url = "http://resultados-estadisticas/resultados";  // ✅ Nombre del servicio
```

### 📁 Implementación de Comunicación entre Microservicios

Para demostrar el descubrimiento dinámico, vamos a crear un endpoint en `votaciones-service` que consulte a `resultados-estadisticas` usando su nombre lógico.

#### Paso 1: Agregar `RestTemplate` con Load Balancing

**Archivo:** `votaciones-service/.../config/RestTemplateConfig.java`
```java
package com.votaciones.votaciones.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    
    @Bean
    @LoadBalanced  // ← Habilita el descubrimiento de servicios
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

**Explicación:**
- `@LoadBalanced`: Intercepta las llamadas HTTP y resuelve los nombres de servicio usando Eureka
- En lugar de `http://localhost:8083`, puedes usar `http://resultados-estadisticas`

#### Paso 2: Crear un Service que use RestTemplate

**Archivo:** `votaciones-service/.../service/EstadisticasClientService.java`
```java
package com.votaciones.votaciones.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EstadisticasClientService {
    
    private final RestTemplate restTemplate;
    
    public EstadisticasClientService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    public String obtenerEstadisticas() {
        // ✅ Usa el NOMBRE del servicio, NO la IP
        String url = "http://resultados-estadisticas/resultados/estadisticas";
        return restTemplate.getForObject(url, String.class);
    }
    
    public String obtenerResultados() {
        // ✅ Eureka resuelve automáticamente la IP y puerto
        String url = "http://resultados-estadisticas/resultados";
        return restTemplate.getForObject(url, String.class);
    }
}
```

#### Paso 3: Crear un endpoint de prueba

**Archivo:** `votaciones-service/.../controller/VotacionesController.java` (agregar método)
```java
@RestController
@RequestMapping("/votaciones")
public class VotacionesController {
    
    private final EstadisticasClientService estadisticasClient;
    
    // Constructor...
    
    @GetMapping("/estadisticas-remotas")
    public ResponseEntity<String> obtenerEstadisticasRemotas() {
        // Este endpoint llama a resultados-estadisticas usando su nombre lógico
        String estadisticas = estadisticasClient.obtenerEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }
}
```

### 🧪 Prueba: Descubrimiento Dinámico Funcionando

#### 1. Verificar que ambos servicios están en Eureka
```bash
curl http://localhost:8761/eureka/apps
```

**Debe mostrar:**
- `VOTACIONES-SERVICE`
- `RESULTADOS-ESTADISTICAS`

#### 2. Probar comunicación directa (sin Eureka)
```bash
# Acceso directo al microservicio
curl http://localhost:8083/resultados
```

#### 3. Probar comunicación a través de nombre lógico
```bash
# Desde votaciones-service, que usa el nombre lógico
curl http://localhost:8082/votaciones/estadisticas-remotas
```

**Resultado esperado:**
- La respuesta proviene de `resultados-estadisticas`
- `votaciones-service` resolvió el nombre usando Eureka
- No hay IPs hardcodeadas en el código

### 📌 Demostración Visual

**Captura de pantalla recomendada:**
1. Dashboard de Eureka mostrando ambos servicios registrados
2. Logs mostrando la resolución del nombre del servicio
3. Respuesta del endpoint que usa el nombre lógico

---

## 🎯 VERIFICACIÓN COMPLETA DEL CRITERIO

### ✅ 1. Eureka Server levanta correctamente

**Comando:**
```bash
docker ps | grep eureka
curl http://localhost:8761
```

**Evidencia:**
- Contenedor `eureka-server` corriendo
- Dashboard accesible en el navegador

---

### ✅ 2. Microservicios registrados en Eureka

**Comando:**
```bash
# Ver en el Dashboard
# Abrir: http://localhost:8761

# O consultar API
curl http://localhost:8761/eureka/apps
```

**Evidencia:**
- En el Dashboard de Eureka, sección "Instances currently registered with Eureka"
- Aparece: `RESULTADOS-ESTADISTICAS` con status `UP`
- Aparece: `VOTACIONES-SERVICE` con status `UP` (si está corriendo)

---

### ✅ 3. Descubrimiento dinámico funcional

**Demostración:**

**Opción A: Usando API Gateway**
El API Gateway usa nombres lógicos para enrutar:
```yaml
# api-gateway/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: resultados-route
          uri: lb://resultados-estadisticas  # ← Nombre lógico
          predicates:
            - Path=/resultados/**
```

**Opción B: Comunicación directa entre microservicios**
Crear un endpoint en `votaciones-service` que consulte a `resultados-estadisticas`:

```bash
# 1. votaciones-service consulta a resultados-estadisticas por nombre
curl http://localhost:8082/votaciones/estadisticas-remotas

# 2. Internamente, usa: http://resultados-estadisticas/resultados
# 3. Eureka resuelve la IP y puerto automáticamente
```

**Evidencia:**
- El código no tiene IPs hardcodeadas
- La comunicación funciona usando solo el nombre del servicio
- Eureka resuelve automáticamente la ubicación real del servicio

---

## 📊 DEMOSTRACIÓN EN TIEMPO REAL

### Secuencia de Demostración (5 minutos)

#### 1. Mostrar que Eureka está corriendo (30 seg)
```bash
docker ps | grep eureka
```

#### 2. Abrir Dashboard de Eureka (1 min)
```
http://localhost:8761
```

**Mostrar:**
- El dashboard carga correctamente
- Sección "Instances currently registered with Eureka"
- Microservicios registrados

#### 3. Mostrar configuración del cliente (1 min)
```bash
# Mostrar application.properties
cat resultados_estadisticas/src/main/resources/application.properties | grep eureka
```

#### 4. Verificar registro mediante API (1 min)
```bash
# Consultar servicios registrados
curl -H "Accept: application/json" http://localhost:8761/eureka/apps/RESULTADOS-ESTADISTICAS | jq .
```

#### 5. Mostrar logs de registro (1 min)
```bash
docker compose logs resultados-estadisticas | grep -i "registered with eureka"
```

#### 6. Demostrar descubrimiento dinámico (1.5 min)
```bash
# Opción 1: A través del Gateway
curl http://localhost:8080/resultados/estadisticas

# Opción 2: Ver configuración del Gateway
cat api-gateway/src/main/resources/application.yml | grep -A 3 "resultados"
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

### Antes de la demostración:
- [ ] Eureka Server corriendo
- [ ] Dashboard de Eureka accesible (http://localhost:8761)
- [ ] `resultados-estadisticas` corriendo
- [ ] `resultados-estadisticas` registrado en Eureka
- [ ] API Gateway configurado (opcional para demo)

### Durante la demostración:
- [ ] Mostrar Dashboard de Eureka con servicios registrados
- [ ] Mostrar `application.properties` con configuración de Eureka
- [ ] Mostrar logs de registro en Eureka
- [ ] Ejecutar `curl` al API de Eureka para ver servicios
- [ ] Demostrar comunicación por nombre lógico (Gateway o RestTemplate)
- [ ] Explicar que NO hay IPs hardcodeadas

---

## 💡 RESPUESTAS A POSIBLES PREGUNTAS

**P: ¿Por qué usar Eureka y no IPs fijas?**
> R: "Con IPs fijas, si un servicio se mueve a otro servidor, debemos cambiar el código. Con Eureka, los servicios se registran automáticamente y otros servicios los encuentran por nombre. Es dinámico y escalable."

**P: ¿Qué pasa si Eureka se cae?**
> R: "Los microservicios guardan un caché local del registro. Pueden seguir comunicándose temporalmente incluso si Eureka no está disponible. Cuando Eureka vuelve, se sincronizan."

**P: ¿Cómo sabe Eureka si un servicio está vivo?**
> R: "Los microservicios envían 'heartbeats' cada 30 segundos a Eureka. Si Eureka no recibe heartbeats, marca el servicio como DOWN y lo quita del registro."

**P: ¿Dónde se usa el nombre lógico?**
> R: "En el API Gateway (en las rutas) y en los `RestTemplate` con `@LoadBalanced`. En lugar de `http://localhost:8083` usamos `http://resultados-estadisticas`."

---

## 🚀 COMANDOS RÁPIDOS PARA LA DEMO

```bash
# 1. Ver Dashboard de Eureka
# Abrir en navegador: http://localhost:8761

# 2. Ver servicios registrados
docker ps | grep -E "(eureka|ms-resultados)"

# 3. Consultar API de Eureka (JSON)
curl -H "Accept: application/json" http://localhost:8761/eureka/apps | jq .

# 4. Ver configuración de Eureka Client
cat resultados_estadisticas/src/main/resources/application.properties | grep -A 2 "eureka"

# 5. Ver logs de registro
docker compose logs resultados-estadisticas | grep -i "eureka"

# 6. Verificar health del servicio
curl http://localhost:8083/actuator/health
```

---

## 📸 CAPTURAS DE PANTALLA RECOMENDADAS

1. **Dashboard de Eureka** mostrando `RESULTADOS-ESTADISTICAS` registrado
2. **application.properties** con configuración de Eureka Client
3. **Logs del microservicio** mostrando "Registered with Eureka"
4. **API de Eureka** (curl) mostrando el servicio registrado en JSON
5. **Gateway configuration** mostrando uso de nombre lógico

---

## 🎉 RESUMEN

✅ **Eureka Server funcionando**: Dashboard accesible en http://localhost:8761  
✅ **Microservicio registrado**: `RESULTADOS-ESTADISTICAS` visible en Eureka  
✅ **Descubrimiento dinámico**: API Gateway y RestTemplate usan nombres lógicos, NO IPs  

**Código fuente en:**
- `eureka-server/` (configuración del servidor)
- `resultados_estadisticas/application.properties` (configuración del cliente)
- `api-gateway/application.yml` (uso de nombres lógicos en rutas)

---

**✅ CON ESTO TIENES COMPLETO EL CRITERIO DE EUREKA SERVER ✅**

