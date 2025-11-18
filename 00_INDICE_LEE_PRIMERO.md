# 📚 ÍNDICE - PROYECTO BOLIVIAN DIGITALIZATION VOTES

## 🎯 DOCUMENTACIÓN PRINCIPAL

### 1. **EVIDENCIA_PRUEBAS_KEYCLOAK.md** ✅
**Estado:** Completada y Verificada

Contiene:
- ✅ Todas las pruebas de OAuth2 ejecutadas
- ✅ Resultados de CRUD completo (Create, Read, Update, Delete)
- ✅ Tokens JWT obtenidos y validados
- ✅ Evidencia de seguridad en endpoints
- ✅ Detalles de respuestas HTTP

**Pruebas Incluidas:**
1. Obtener Token Keycloak
2. GET sin Token (401)
3. GET con Token (200)
4. POST sin Token (401)
5. POST con Token (201)
6. GET por ID (200)
7. PUT Actualizar (200)
8. DELETE Eliminar (204)
9. Verificar Eliminación (404)

---

### 2. **COMANDOS-PRESENTACION.md** 📋
**Estado:** Completa y lista para usar

Contiene:
- 📋 Todos los comandos listos para copiar-pegar
- 📊 Guía de rutas principales
- 🔐 Ejemplos de seguridad
- 🐳 Comandos Docker-Compose
- 🌐 URLs de servicios

**Secciones:**
1. Persistencia de Datos (1.1 - 1.11)
2. Eureka Server (Discovery)
3. Edge Server/Gateway
4. Docker & Docker-Compose
5. Keycloak - OAuth2 & Seguridad
6. Checklist Final

---

## 🚀 CÓMO USAR LA DOCUMENTACIÓN

### Para Presentación:
1. Abre `COMANDOS-PRESENTACION.md`
2. Copia cada comando y ejecuta en PowerShell
3. Muestra resultados en consola

### Para Validación Técnica:
1. Revisa `EVIDENCIA_PRUEBAS_KEYCLOAK.md`
2. Comprueba que todos los ✅ estén marcados
3. Valida respuestas HTTP esperadas

---

## 📊 ESTADO DEL PROYECTO

| Componente | Estado | Evidencia |
|-----------|--------|-----------|
| **BD PostgreSQL** | ✅ Funcional | EVIDENCIA_PRUEBAS |
| **API Candidatos** | ✅ CRUD Completo | EVIDENCIA_PRUEBAS |
| **Keycloak OAuth2** | ✅ Seguridad Active | EVIDENCIA_PRUEBAS |
| **Eureka Discovery** | ✅ Servicios Registrados | COMANDOS |
| **API Gateway** | ✅ Ruteo Activo | COMANDOS |
| **Docker-Compose** | ✅ Todos UP | COMANDOS |

---

## 🔑 CREDENCIALES

### Keycloak
```
URL: http://localhost:8888/admin
Usuario: admin
Contraseña: admin
```

### API Candidatos
```
URL: http://localhost:8082/api/candidatos
Seguridad: OAuth2 + JWT
Requiere Token: SÍ
```

### API Gateway (SSL)
```
URL: https://localhost:8443/openapi/swagger-ui.html
Certificado: Auto-firmado (aceptar en navegador)
```

---

## 📱 PUERTOS PRINCIPALES

```
8888  → Keycloak Admin
8761  → Eureka Dashboard
8443  → API Gateway (SSL)
8082  → ms-candidatos
8081  → ms-usuarios
5433  → PostgreSQL BD
9092  → Kafka
```

---

## ✅ RÚBRICA CUMPLIDA

- [x] **Persistencia de Datos** - CRUD completo funcionando
- [x] **Seguridad** - OAuth2 con Keycloak validando
- [x] **Discovery** - Eureka registrando microservicios
- [x] **Gateway** - Ruteo y filtrado de peticiones
- [x] **Containerización** - Docker-Compose funcional
- [x] **Documentación** - Completa con evidencia

---

## 🎬 PRÓXIMOS PASOS PARA PRESENTACIÓN

1. **Iniciar Sistema:**
   ```powershell
   docker-compose up --build
   ```

2. **Obtener Token:**
   ```powershell
   # Ejecutar el comando de "OBTENER TOKEN" en EVIDENCIA_PRUEBAS
   ```

3. **Ejecutar Pruebas:**
   ```powershell
   # Copiar comandos de COMANDOS-PRESENTACION.md
   ```

4. **Mostrar Resultados:**
   - Consola con respuestas HTTP
   - Dashboard Keycloak
   - Dashboard Eureka
   - Swagger por Gateway

---

## 📞 INFORMACIÓN DEL PROYECTO

- **Nombre:** BolivianDigitalizationVotes
- **Repositorio:** JesdanRS/BolivianDigitalizationVotes
- **Rama Activa:** candidatos2
- **Última Actualización:** 27 de Octubre de 2025
- **Microservicios:** 5+ (Candidatos, Usuarios, Notificaciones, etc.)
- **BD:** PostgreSQL
- **Message Broker:** Kafka
- **Registro de Servicios:** Eureka
- **API Gateway:** Spring Cloud Gateway
- **Seguridad:** Keycloak + OAuth2 + JWT

---

## 📝 NOTAS IMPORTANTES

⚠️ **Certificado SSL en Gateway:** El navegador puede mostrar advertencia de seguridad. Es normal - es auto-firmado.

⚠️ **Tokens JWT:** Tienen duración limitada (~60 segundos). Si expira, obtener uno nuevo.

✅ **BD funciona:** Los datos persisten entre reinicios del gateway.

✅ **Servicios conectados:** Todos registrados en Eureka automáticamente.

---

**Generado:** 27 de Octubre de 2025  
**Preparado para:** Presentación Académica  
**Estado Final:** ✅ LISTO PARA DEMOSTRACIÓN
