# 📮 EJEMPLOS EXACTOS PARA POSTMAN

## 🔐 1. OBTENER TOKEN DE ADMIN

### Request
```
POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
```

### Headers
```
Content-Type: application/x-www-form-urlencoded
```

### Body (x-www-form-urlencoded)
```
client_id=votaciones-client
username=admin
password=admin123
grant_type=password
```

### Response Exitosa (200 OK)
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxxx...",
  "expires_in": 3600,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "scope": "profile email"
}
```

**👉 COPIA EL `access_token` COMPLETO**

---

## 🔐 2. OBTENER TOKEN DE USER

### Request
```
POST http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
```

### Headers
```
Content-Type: application/x-www-form-urlencoded
```

### Body (x-www-form-urlencoded)
```
client_id=votaciones-client
username=user
password=user123
grant_type=password
```

### Response Exitosa (200 OK)
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxxx...",
  "expires_in": 3600,
  ...
}
```

---

## ✅ 3. LISTAR RESULTADOS (Con Token)

### Request
```
GET http://localhost:8080/ms-resultados/api/resultados
```

### Headers
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxxx...
```

### Response Exitosa (200 OK)
```json
[
  {
    "id": 1,
    "numeroMesa": 1001,
    "departamento": "La Paz",
    "provincia": "Murillo",
    "municipio": "La Paz",
    "recinto": "Colegio Nacional Don Bosco",
    "inscritos": 500,
    "votosValidos": 450,
    "votosNulos": 30,
    "votosBlancos": 20
  },
  {
    "id": 2,
    "numeroMesa": 1002,
    "departamento": "Cochabamba",
    ...
  }
]
```

---

## ✅ 4. CREAR RESULTADO (Solo ADMIN)

### Request
```
POST http://localhost:8080/ms-resultados/api/resultados
```

### Headers
```
Authorization: Bearer TOKEN_DE_ADMIN_AQUI
Content-Type: application/json
```

### Body (raw JSON)
```json
{
  "numeroMesa": 1001,
  "departamento": "La Paz",
  "provincia": "Murillo",
  "municipio": "La Paz",
  "recinto": "Colegio Nacional Don Bosco",
  "inscritos": 500,
  "votosValidos": 450,
  "votosNulos": 30,
  "votosBlancos": 20
}
```

### Response Exitosa (201 Created)
```json
{
  "id": 1,
  "numeroMesa": 1001,
  "departamento": "La Paz",
  "provincia": "Murillo",
  "municipio": "La Paz",
  "recinto": "Colegio Nacional Don Bosco",
  "inscritos": 500,
  "votosValidos": 450,
  "votosNulos": 30,
  "votosBlancos": 20
}
```

---

## ✅ 5. OBTENER RESULTADO POR ID

### Request
```
GET http://localhost:8080/ms-resultados/api/resultados/1
```

### Headers
```
Authorization: Bearer TOKEN_AQUI
```

### Response Exitosa (200 OK)
```json
{
  "id": 1,
  "numeroMesa": 1001,
  "departamento": "La Paz",
  "provincia": "Murillo",
  "municipio": "La Paz",
  "recinto": "Colegio Nacional Don Bosco",
  "inscritos": 500,
  "votosValidos": 450,
  "votosNulos": 30,
  "votosBlancos": 20
}
```

---

## ✅ 6. BUSCAR POR DEPARTAMENTO (Derived Query)

### Request
```
GET http://localhost:8080/ms-resultados/api/resultados/departamento/La Paz
```

### Headers
```
Authorization: Bearer TOKEN_AQUI
```

### Response Exitosa (200 OK)
```json
[
  {
    "id": 1,
    "numeroMesa": 1001,
    "departamento": "La Paz",
    ...
  },
  {
    "id": 3,
    "numeroMesa": 1003,
    "departamento": "La Paz",
    ...
  }
]
```

---

## ✅ 7. BUSCAR POR MÍNIMO INSCRITOS (JPQL Query)

### Request
```
GET http://localhost:8080/ms-resultados/api/resultados/inscritos-minimo/300
```

### Headers
```
Authorization: Bearer TOKEN_AQUI
```

### Response Exitosa (200 OK)
```json
[
  {
    "id": 1,
    "numeroMesa": 1001,
    "inscritos": 500,
    ...
  },
  {
    "id": 2,
    "numeroMesa": 1002,
    "inscritos": 450,
    ...
  }
]
```

---

## ✅ 8. BUSCAR POR VOTOS VÁLIDOS MÍNIMOS (Native Query)

### Request
```
GET http://localhost:8080/ms-resultados/api/resultados/votos-validos-minimo/200
```

### Headers
```
Authorization: Bearer TOKEN_AQUI
```

### Response Exitosa (200 OK)
```json
[
  {
    "id": 1,
    "numeroMesa": 1001,
    "votosValidos": 450,
    ...
  }
]
```

---

## ✅ 9. ACTUALIZAR RESULTADO (Solo ADMIN)

### Request
```
PUT http://localhost:8080/ms-resultados/api/resultados/1
```

### Headers
```
Authorization: Bearer TOKEN_DE_ADMIN_AQUI
Content-Type: application/json
```

### Body (raw JSON)
```json
{
  "numeroMesa": 1001,
  "departamento": "La Paz",
  "provincia": "Murillo",
  "municipio": "La Paz",
  "recinto": "Colegio Nacional Don Bosco - ACTUALIZADO",
  "inscritos": 550,
  "votosValidos": 500,
  "votosNulos": 30,
  "votosBlancos": 20
}
```

### Response Exitosa (200 OK)
```json
{
  "id": 1,
  "numeroMesa": 1001,
  "departamento": "La Paz",
  "provincia": "Murillo",
  "municipio": "La Paz",
  "recinto": "Colegio Nacional Don Bosco - ACTUALIZADO",
  "inscritos": 550,
  "votosValidos": 500,
  "votosNulos": 30,
  "votosBlancos": 20
}
```

---

## ✅ 10. ELIMINAR RESULTADO (Solo ADMIN)

### Request
```
DELETE http://localhost:8080/ms-resultados/api/resultados/1
```

### Headers
```
Authorization: Bearer TOKEN_DE_ADMIN_AQUI
```

### Response Exitosa (204 No Content)
```
(Sin body, solo código 204)
```

---

## ❌ 11. PRUEBA SIN TOKEN (Debe fallar)

### Request
```
GET http://localhost:8080/ms-resultados/api/resultados
```

### Headers
```
(Sin Authorization header)
```

### Response Error (401 Unauthorized)
```json
{
  "timestamp": "2024-10-27T22:41:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Unauthorized",
  "path": "/ms-resultados/api/resultados"
}
```

---

## ❌ 12. PRUEBA USER INTENTA CREAR (Debe fallar)

### Request
```
POST http://localhost:8080/ms-resultados/api/resultados
```

### Headers
```
Authorization: Bearer TOKEN_DE_USER_AQUI
Content-Type: application/json
```

### Body (raw JSON)
```json
{
  "numeroMesa": 9999,
  "departamento": "Test",
  "provincia": "Test",
  "municipio": "Test",
  "recinto": "Test",
  "inscritos": 100,
  "votosValidos": 90,
  "votosNulos": 5,
  "votosBlancos": 5
}
```

### Response Error (403 Forbidden)
```json
{
  "timestamp": "2024-10-27T22:41:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Forbidden",
  "path": "/ms-resultados/api/resultados"
}
```

---

## 📊 RESUMEN DE CÓDIGOS HTTP

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200 OK | Éxito | GET, PUT exitosos |
| 201 Created | Creado | POST exitoso |
| 204 No Content | Sin contenido | DELETE exitoso |
| 401 Unauthorized | No autenticado | Sin token o token inválido |
| 403 Forbidden | Sin permisos | Token válido pero sin rol necesario |
| 404 Not Found | No encontrado | ID no existe |

---

## 🎯 TIPS IMPORTANTES

1. **El token expira en 1 hora** → Si recibes 401 después de un tiempo, obtén un nuevo token

2. **Usa el Gateway** → Siempre accede a través de `http://localhost:8080/ms-resultados/...`

3. **Copia el token completo** → No olvides incluir todo el token (es muy largo)

4. **Formato del header** → Debe ser: `Authorization: Bearer TOKEN` (con espacio después de "Bearer")

5. **Para crear datos** → Primero obtén token de ADMIN, luego haz POST

6. **Para consultar** → Puedes usar token de USER o ADMIN

---

## 🔗 URLs de Referencia

- **Token:** http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token
- **API:** http://localhost:8080/ms-resultados/api/resultados
- **Swagger:** http://localhost:8080/ms-resultados/swagger-ui.html
- **Decodificar Token:** https://jwt.io/

---

¡Con estos ejemplos puedes copiar y pegar directamente en Postman! 🚀
