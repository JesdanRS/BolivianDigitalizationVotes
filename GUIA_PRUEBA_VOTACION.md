# Guía de Prueba - Control de Votación por Usuario

## 🔧 Preparación

### 1. Asegúrate de que el backend esté corriendo
```bash
cd backendBait
npm run dev
```

### 2. Asegúrate de que el frontend esté corriendo
```bash
cd frontend
npm run dev
```

### 3. Verifica que tengas votantes en la base de datos
```bash
cd backendBait
npm run seed:votantes
```

## 📝 Flujo de Prueba Completo

### Paso 1: Iniciar Sesión
1. Abre el navegador en `http://localhost:5174/login` (o el puerto que esté usando Vite)
2. Ingresa las credenciales de un votante de la base de datos:
   - **Carnet**: `13120200` (u otro carnet de la BD)
   - **Fecha de Nacimiento**: (fecha del votante en formato DD/MM/AAAA)
3. Ingresa el código de verificación que llega al correo
4. Deberías ser redirigido a `/votacion`

### Paso 2: Verificar Página de Votación (Primera Vez)
1. La página debería mostrar:
   - ✅ Título "Elige tu Candidato"
   - ✅ Lista de 5 candidatos
   - ✅ Cámara activada (puede haber modal de seguridad si no detecta rostro)
2. Verifica en la consola del navegador (F12):
   - Debería mostrar: "✅ Candidatos cargados desde el backend"
   - NO debería haber errores de autenticación

### Paso 3: Votar por Primera Vez
1. Haz clic en el botón "Votar →" de cualquier candidato
2. Debería aparecer el **Modal de Confirmación**:
   - Muestra la foto y nombre del candidato
   - Pregunta "¿Estás seguro de tu elección?"
   - Botones: "Cancelar" y "Confirmar Voto"
3. Haz clic en **"Confirmar Voto"**
4. Debería aparecer el **Modal de Éxito**:
   - ✅ Ícono verde con check
   - ✅ Mensaje "¡Voto realizado con éxito!"
   - Botón "Aceptar"
5. Al hacer clic en "Aceptar", serás redirigido a `/resultados`

### Paso 4: Intentar Votar de Nuevo (Segunda Vez)
1. Navega de nuevo a `/votacion` (o presiona el botón "Candidatos" en el navbar)
2. La página debería mostrar automáticamente:
   - ✅ Ícono azul con check
   - ✅ Mensaje "Ya has votado"
   - ✅ Texto: "Tu voto ha sido registrado exitosamente. No puedes votar nuevamente."
   - ✅ Botón "Ver Resultados"
3. **NO** debería mostrar la lista de candidatos
4. **NO** debería activar la cámara

### Paso 5: Verificar en Base de Datos (MongoDB Atlas)
1. Ve a tu cluster de MongoDB Atlas
2. Busca la colección `votantes`
3. Encuentra el documento del votante que usaste
4. Verifica que el campo `haVotado` esté en `true`
5. Ve a la colección `votos`
6. Deberías ver un nuevo voto con:
   - `candidatoId`: ID del candidato
   - `votanteId`: ID del votante
   - `fechaVoto`: timestamp del voto

## 🧪 Pruebas Adicionales

### Prueba A: Intentar acceder sin autenticación
1. Abre una ventana de incógnito
2. Ve directamente a `http://localhost:5174/votacion`
3. Deberías ser **redirigido automáticamente** a `/login`

### Prueba B: Verificar estado de votación vía API
```bash
# Reemplaza VOTANTE_ID con el _id del votante
curl http://localhost:5000/api/votaciones/verificar/VOTANTE_ID
```

Respuesta esperada (antes de votar):
```json
{
  "success": true,
  "data": {
    "haVotado": false,
    "nombre": "Nombre del Votante"
  }
}
```

Respuesta esperada (después de votar):
```json
{
  "success": true,
  "data": {
    "haVotado": true,
    "nombre": "Nombre del Votante"
  }
}
```

### Prueba C: Intentar votar dos veces vía API
```bash
# Primera votación
curl -X POST http://localhost:5000/api/votaciones/votar \
  -H "Content-Type: application/json" \
  -d '{
    "candidatoId": "CANDIDATO_ID",
    "votanteId": "VOTANTE_ID"
  }'

# Segunda votación (debería fallar)
curl -X POST http://localhost:5000/api/votaciones/votar \
  -H "Content-Type: application/json" \
  -d '{
    "candidatoId": "OTRO_CANDIDATO_ID",
    "votanteId": "VOTANTE_ID"
  }'
```

Respuesta esperada (segunda votación):
```json
{
  "success": false,
  "message": "Este usuario ya ha votado. No puede votar nuevamente."
}
```
HTTP Status: `403 Forbidden`

## 🐛 Solución de Problemas

### Error: "El ID del votante es requerido"
**Causa**: El usuario no está autenticado
**Solución**: 
1. Cierra sesión y vuelve a iniciar sesión
2. Verifica que `localStorage` tenga los datos del usuario (F12 → Application → Local Storage)

### Error: "Votante no encontrado"
**Causa**: El ID del votante no existe en la base de datos
**Solución**: 
1. Ejecuta `npm run seed:votantes` para poblar la BD
2. Verifica que el ID en localStorage coincida con uno en MongoDB

### No redirige después de votar
**Causa**: El modal de éxito no cierra correctamente
**Solución**: 
1. Verifica que `navigate('/resultados')` se ejecute en el callback del modal
2. Recarga la página

### Cámara no se activa
**Causa**: Permisos de cámara no otorgados
**Solución**: 
1. Verifica los permisos del navegador
2. Acepta el permiso de cámara cuando el navegador lo solicite

## ✅ Lista de Verificación

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo (puerto 5173 o 5174)
- [ ] Votantes en base de datos (seed ejecutado)
- [ ] Login funciona correctamente
- [ ] Primera votación exitosa
- [ ] Campo `haVotado` cambia a `true` en BD
- [ ] Voto se registra en colección `votos`
- [ ] Segundo intento de voto muestra mensaje "Ya has votado"
- [ ] Redirige a resultados después de votar
- [ ] No permite acceso a /votacion sin autenticación

## 📊 Datos de Prueba

Si necesitas datos de prueba, usa estos carnets (asegúrate de que existan en tu BD con `npm run seed:votantes`):

```
Carnet: 13120200
Fecha: [fecha en tu BD]

Carnet: 12735190
Fecha: [fecha en tu BD]
```

---

**¡La funcionalidad está lista!** Si encuentras algún problema, revisa los logs de:
- Backend: terminal donde corre `npm run dev`
- Frontend: consola del navegador (F12 → Console)
