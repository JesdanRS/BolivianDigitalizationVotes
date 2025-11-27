# Control de Votación por Usuario

## Cambios Implementados

### 1. Modelo de Voto Actualizado
- **Archivo**: `backendBait/services/votaciones/models/Voto.js`
- **Cambios**:
  - Agregado campo `votanteId` como referencia al modelo `Votante`
  - Agregado índice para `votanteId` para mejorar consultas

### 2. Controlador de Votaciones Actualizado
- **Archivo**: `backendBait/services/votaciones/controllers/votacionController.js`
- **Cambios**:
  - **Función `registrarVoto`**:
    - Ahora requiere `votanteId` en el body de la petición
    - Verifica que el votante exista en la base de datos
    - Verifica que el votante NO haya votado antes (`haVotado === false`)
    - Registra el voto con el ID del votante
    - Marca `haVotado = true` después de registrar el voto
    - Retorna error 403 si el usuario ya votó
  
  - **Nueva función `verificarEstadoVotacion`**:
    - Permite consultar si un votante específico ya ha votado
    - Útil para el frontend para mostrar estado antes de votar

### 3. Rutas Actualizadas
- **Archivo**: `backendBait/services/votaciones/routes/votacionRoutes.js`
- **Cambios**:
  - Agregada ruta `GET /api/votaciones/verificar/:votanteId`

## Endpoints API

### POST /api/votaciones/votar
Registra un voto (control por usuario)

**Body:**
```json
{
  "candidatoId": "ID_DEL_CANDIDATO",
  "votanteId": "ID_DEL_VOTANTE"
}
```

**Respuestas:**
- `201`: Voto registrado exitosamente
- `400`: Falta candidatoId o votanteId
- `403`: El usuario ya ha votado
- `404`: Candidato o votante no encontrado

### GET /api/votaciones/verificar/:votanteId
Verifica si un votante ya ha votado

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "haVotado": false,
    "nombre": "Nombre del Votante"
  }
}
```

## Flujo de Votación

1. **Login**: Usuario inicia sesión con carnet y fecha de nacimiento
2. **Verificación**: Frontend verifica si el usuario ya votó usando `/api/votaciones/verificar/:votanteId`
3. **Votación**: 
   - Si NO ha votado → Permite accesar la página de votación
   - Si YA votó → Muestra mensaje "Ya has votado"
4. **Registro de Voto**: Frontend envía `votanteId` junto con `candidatoId` al endpoint `/api/votaciones/votar`
5. **Actualización**: Backend marca `haVotado = true` en el votante
6. **Confirmación**: Se muestra mensaje de éxito

## Variables de Sesión (Frontend)

El frontend necesitará guardar después del login:
```javascript
// En localStorage o estado de React
{
  votanteId: "ID_DEL_VOTANTE",
  nombre: "Nombre del Votante",
  haVotado: false
}
```

## Próximos Pasos para el Frontend

1. Actualizar la página de votación para:
   - Leer `votanteId` del estado/localStorage
   - Verificar estado de votación al cargar
   - Enviar `votanteId` al registrar voto
   - Manejar error 403 si el usuario ya votó

2. Agregar redirección si el usuario ya votó:
   - Mostrar mensaje "Ya has votado"
   - Redirigir a página de resultados

## Testing

Para probar la funcionalidad:

```bash
# 1. Verificar estado de votación
GET http://localhost:5000/api/votaciones/verificar/VOTANTE_ID

# 2. Registrar voto (primera vez)
POST http://localhost:5000/api/votaciones/votar
Body: {
  "candidatoId": "CANDIDATO_ID",
  "votanteId": "VOTANTE_ID"
}

# 3. Intentar votar de nuevo (debería fallar)
POST http://localhost:5000/api/votaciones/votar
Body: {
  "candidatoId": "OTRO_CANDIDATO_ID",
  "votanteId": "VOTANTE_ID"
}
# Respuesta esperada: 403 - "Este usuario ya ha votado"
```
