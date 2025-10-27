# 🔐 Keycloak - Guía Completa para Evaluación

## 📚 Documentación Disponible

He creado 4 documentos para ayudarte:

1. **`PASOS_RAPIDOS_KEYCLOAK.md`** ⚡ → Guía rápida de 5 minutos
2. **`GUIA_KEYCLOAK_POSTMAN.md`** 📖 → Guía completa con explicaciones
3. **`EJEMPLOS_POSTMAN.md`** 📮 → Ejemplos exactos para copiar/pegar
4. **`Keycloak_Resultados.postman_collection.json`** 📦 → Colección de Postman lista para importar

---

## 🎯 ¿Qué es Keycloak y Para Qué Sirve?

**Keycloak** es un servidor de autenticación que:
- Genera **tokens JWT** para identificar usuarios
- Maneja **roles** (ADMIN, USER) para controlar permisos
- Protege tus endpoints para que solo usuarios autorizados accedan

### Flujo Simple
```
1. Usuario pide token → Keycloak valida credenciales
2. Keycloak devuelve token JWT
3. Usuario envía token en cada petición
4. Microservicio valida token y permite/deniega acceso
```

---

## ⚙️ Tu Configuración Actual

### ✅ Ya está todo configurado

Tu microservicio `resultados_estadisticas` YA tiene:

1. **Keycloak en Docker** (puerto 8180)
2. **Realm configurado** (`votaciones-realm`)
3. **2 usuarios creados:**
   - `admin` / `admin123` (rol ADMIN)
   - `user` / `user123` (rol USER)
4. **SecurityConfig** con validación JWT
5. **Endpoints protegidos** con `@PreAuthorize`

### 📍 Ubicación de archivos importantes

```
BolivianDigitalizationVotes/
├── docker-compose.yml                    # Keycloak configurado (líneas 115-133)
├── keycloak/
│   └── votaciones-realm.json            # Configuración de usuarios y roles
└── resultados_estadisticas/
    └── src/main/java/.../config/
        └── SecurityConfig.java           # Configuración de seguridad
```

---

## 🚀 Cómo Probar (3 Pasos)

### Paso 1: Levantar Servicios
```bash
docker-compose up -d
# Esperar 30-60 segundos
```

### Paso 2: Importar Colección en Postman
1. Abre Postman
2. Click **Import**
3. Selecciona: `Keycloak_Resultados.postman_collection.json`
4. ¡Listo! Tienes 15+ peticiones pre-configuradas

### Paso 3: Ejecutar Peticiones
1. Carpeta **"1. Autenticación Keycloak"** → Ejecuta "Obtener Token - ADMIN"
2. Carpeta **"2. CRUD Resultados"** → Ejecuta "Listar Resultados (ADMIN)"
3. Carpeta **"4. Pruebas de Seguridad"** → Ejecuta las pruebas de error

---

## 📋 Criterios de Evaluación - Keycloak

| Criterio | Descripción | Cómo Demostrarlo |
|----------|-------------|------------------|
| **Configuración de realm y roles** | Realm creado con roles y usuarios | Screenshot del archivo `votaciones-realm.json` o panel admin de Keycloak |
| **Integración con microservicios** | Endpoints requieren token JWT | Screenshot de Postman obteniendo token exitosamente |
| **Protección de endpoints** | Endpoints con `@PreAuthorize` | Screenshot del código `SecurityConfig.java` y `ResultadosController.java` con anotaciones |
| **Peticiones sin token devuelven 401** | Sin token = error | Screenshot de Postman sin token → 401 Unauthorized |
| **Peticiones sin rol devuelven 403** | USER intenta crear = error | Screenshot de Postman con token USER haciendo POST → 403 Forbidden |
| **Peticiones con token válido funcionan** | Con token correcto = éxito | Screenshot de Postman con token → 200 OK con datos |

---

## 📸 Capturas de Pantalla Necesarias

### 1. Configuración de Keycloak
- [ ] Archivo `keycloak/votaciones-realm.json` mostrando usuarios y roles
- [ ] Panel de administración de Keycloak (http://localhost:8180/auth)

### 2. Código de Seguridad
- [ ] `SecurityConfig.java` mostrando configuración JWT
- [ ] `ResultadosController.java` mostrando `@PreAuthorize`

### 3. Postman - Token Exitoso
- [ ] Request de obtener token (POST con credenciales)
- [ ] Response con `access_token` visible

### 4. Postman - Endpoint Protegido Funciona
- [ ] Request GET con header `Authorization: Bearer TOKEN`
- [ ] Response 200 OK con datos reales de PostgreSQL

### 5. Postman - Error 401 (Sin Token)
- [ ] Request GET sin header `Authorization`
- [ ] Response 401 Unauthorized

### 6. Postman - Error 403 (Sin Permisos)
- [ ] Request POST con token de USER
- [ ] Response 403 Forbidden

---

## 🎓 Conceptos Clave para Explicar

### ¿Qué es un Token JWT?
Es un "pase VIP" que contiene:
- Quién eres (username, email)
- Qué roles tienes (ADMIN, USER)
- Cuándo expira (1 hora)

### ¿Cómo funciona `@PreAuthorize`?
```java
@PreAuthorize("hasRole('ADMIN')")  // Solo ADMIN puede ejecutar
@PostMapping
public ResponseEntity<ResultadoMesa> crear(...) { ... }

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")  // USER o ADMIN pueden ejecutar
@GetMapping
public ResponseEntity<List<ResultadoMesa>> listar() { ... }
```

### ¿Qué valida Spring Security?
1. ¿El token es válido? (firma, no expirado)
2. ¿El token tiene el rol necesario?
3. Si ambos OK → permite acceso
4. Si no → devuelve 401 o 403

---

## 🔗 URLs Importantes

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Keycloak Admin | http://localhost:8180/auth | admin / admin |
| Obtener Token | http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token | - |
| API Gateway | http://localhost:8080 | - |
| Resultados API | http://localhost:8080/ms-resultados/api/resultados | Token requerido |
| Swagger | http://localhost:8080/ms-resultados/swagger-ui.html | Público |
| Eureka | http://localhost:8761 | - |

---

## 🛠️ Solución de Problemas Comunes

### "Connection refused" al obtener token
**Causa:** Keycloak no está levantado
**Solución:**
```bash
docker logs keycloak
docker-compose restart keycloak
# Esperar 30 segundos
```

### "401 Unauthorized" en endpoint
**Causa:** Token expiró o no se envió
**Solución:** Obtén un nuevo token (expiran en 1 hora)

### "403 Forbidden" en endpoint
**Causa:** El rol no tiene permisos
**Solución:** 
- Para POST/PUT/DELETE → usa token de ADMIN
- Para GET → usa token de USER o ADMIN

### No hay datos al hacer GET
**Causa:** La base de datos está vacía
**Solución:** Primero crea datos con POST usando token de ADMIN

---

## ✅ Checklist Final

Antes de presentar, verifica:

- [ ] Docker containers corriendo (`docker ps`)
- [ ] Keycloak accesible (http://localhost:8180/auth)
- [ ] Token de ADMIN obtenido exitosamente
- [ ] Token de USER obtenido exitosamente
- [ ] GET con token funciona (200 OK)
- [ ] GET sin token falla (401)
- [ ] POST con ADMIN funciona (201)
- [ ] POST con USER falla (403)
- [ ] DELETE con ADMIN funciona (204)
- [ ] DELETE con USER falla (403)
- [ ] Capturas de pantalla tomadas
- [ ] Código fuente revisado (`SecurityConfig.java`, `ResultadosController.java`)

---

## 📊 Resumen de Endpoints por Rol

### Endpoints Públicos (sin token)
- `/swagger-ui/**`
- `/v3/api-docs/**`
- `/actuator/**`

### Endpoints para USER y ADMIN
- `GET /api/resultados` → Listar todos
- `GET /api/resultados/{id}` → Obtener por ID
- `GET /api/resultados/departamento/{dept}` → Buscar por departamento
- `GET /api/resultados/inscritos-minimo/{min}` → Consulta JPQL
- `GET /api/resultados/votos-validos-minimo/{min}` → Consulta Native
- `GET /api/resultados/estadisticas` → Estadísticas

### Endpoints solo para ADMIN
- `POST /api/resultados` → Crear
- `PUT /api/resultados/{id}` → Actualizar
- `DELETE /api/resultados/{id}` → Eliminar

---

## 🎯 Comandos Útiles

```bash
# Ver todos los contenedores
docker ps

# Ver logs de Keycloak
docker logs keycloak

# Ver logs de resultados
docker logs ms-resultados

# Reiniciar Keycloak
docker-compose restart keycloak

# Reiniciar todo
docker-compose restart

# Parar todo
docker-compose down

# Levantar todo
docker-compose up -d
```

---

## 📞 Ayuda Rápida

Si algo no funciona:

1. **Lee primero:** `PASOS_RAPIDOS_KEYCLOAK.md`
2. **Ejemplos exactos:** `EJEMPLOS_POSTMAN.md`
3. **Guía completa:** `GUIA_KEYCLOAK_POSTMAN.md`
4. **Importa colección:** `Keycloak_Resultados.postman_collection.json`

---

## 🎉 ¡Todo Listo!

Tu microservicio `resultados_estadisticas` YA cumple con todos los criterios de Keycloak:

✅ Configuración de realm y roles
✅ Integración con microservicios
✅ Protección de endpoints con `@PreAuthorize`
✅ Validación de tokens JWT
✅ Control de acceso por roles

Solo necesitas:
1. Levantar los servicios
2. Probar con Postman
3. Tomar capturas de pantalla
4. ¡Presentar!

---

**¡Mucha suerte con tu evaluación!** 🚀
