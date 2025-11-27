# Guía de Configuración de Nodemailer con Gmail

Esta guía te ayudará a configurar el envío de correos electrónicos usando Nodemailer con Gmail para el sistema de votación.

## 📋 Requisitos Previos

- Cuenta de Gmail activa
- Node.js y npm instalados
- Backend del proyecto en funcionamiento

## 🔐 Configuración de Gmail

### Paso 1: Habilitar la Verificación en 2 Pasos

Para usar Gmail con aplicaciones externas, primero debes habilitar la verificación en 2 pasos:

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. En el menú lateral, selecciona **"Seguridad"**
3. En la sección **"Cómo inicias sesión en Google"**, haz clic en **"Verificación en 2 pasos"**
4. Sigue las instrucciones para habilitar la verificación en 2 pasos

### Paso 2: Crear una Contraseña de Aplicación

Una vez habilitada la verificación en 2 pasos:

1. Ve a [myaccount.google.com/security](https://myaccount.google.com/security)
2. En la sección **"Cómo inicias sesión en Google"**, busca **"Contraseñas de aplicaciones"**
3. Si no ves esta opción, asegúrate de que la verificación en 2 pasos esté habilitada
4. Haz clic en **"Contraseñas de aplicaciones"**
5. Es posible que te pida ingresar tu contraseña de Gmail nuevamente
6. En el menú desplegable:
   - **Seleccionar app**: Elige "Correo"
   - **Seleccionar dispositivo**: Elige "Otro (nombre personalizado)"
   - Escribe un nombre descriptivo como "Sistema Votación Bolivia"
7. Haz clic en **"Generar"**
8. Google te mostrará una contraseña de 16 caracteres (ejemplo: `abcd efgh ijkl mnop`)
9. **¡IMPORTANTE!** Copia esta contraseña inmediatamente. No podrás verla nuevamente.

## ⚙️ Configuración del Backend

### Paso 3: Crear/Editar el Archivo `.env`

En la carpeta `backendBait`, crea o edita el archivo `.env` con las siguientes variables:

```env
# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017/votaciones

# Configuración de Email
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop

# Puerto del servidor
PORT=5000

# Entorno
NODE_ENV=development
```

**Reemplaza:**

- `tu_correo@gmail.com` con tu correo de Gmail
- `abcd efgh ijkl mnop` con la contraseña de aplicación que generaste (sin espacios)

### Paso 4: Formato Correcto de la Contraseña

La contraseña de aplicación generada por Google tiene espacios, pero debes escribirla **SIN espacios** en el archivo `.env`:

```env
# ❌ INCORRECTO
EMAIL_PASSWORD=abcd efgh ijkl mnop

# ✅ CORRECTO
EMAIL_PASSWORD=abcdefghijklmnop
```

## 🧪 Probar la Configuración

### Paso 5: Inicializar la Base de Datos

Primero, crea los usuarios de prueba en la base de datos:

```bash
cd backendBait
npm run seed:votantes
```

Deberías ver una salida como:

```
🌱 INICIANDO POBLADO DE BASE DE DATOS
✅ 8 votantes insertados correctamente
```

### Paso 6: Iniciar el Servidor

```bash
npm run dev
```

El servidor debería iniciarse sin errores en `http://localhost:5000`

### Paso 7: Probar el Envío de Correos

Puedes probar el login desde el frontend o usar una herramienta como **Postman** o **Thunder Client**:

**POST** `http://localhost:5000/api/auth/login`

**Body (JSON):**

```json
{
  "carnet": "13120200",
  "fechaNacimiento": "08/06/2004"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Código de verificación enviado",
  "data": {
    "emailOculto": "ju***@example.com",
    "carnet": "13120200",
    "nombre": "Juan Carlos Pérez"
  }
}
```

Deberías recibir un correo en la bandeja de entrada del email configurado en el usuario de prueba.

## 🔍 Solución de Problemas

### Error: "Invalid login: 535 Authentication failed"

**Solución:**

- Verifica que hayas habilitado la verificación en 2 pasos
- Asegúrate de estar usando una **Contraseña de aplicación** y no tu contraseña normal de Gmail
- Revisa que copiaste la contraseña sin espacios en el archivo `.env`

### Error: "self signed certificate in certificate chain"

**Solución temporal (solo para desarrollo):**

Edita `backendBait/services/users/services/emailService.js` y modifica la configuración del transporter:

```javascript
return nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Solo para desarrollo
  },
});
```

### Los correos no llegan

**Verificaciones:**

1. Revisa la carpeta de **Spam** en Gmail
2. Verifica que el correo del usuario en la base de datos sea válido
3. Revisa los logs del servidor para ver si hay errores
4. Confirma que las variables de entorno estén cargadas correctamente

### Modo Desarrollo (sin envío real de correos)

Si las variables `EMAIL_USER` y `EMAIL_PASSWORD` no están configuradas, el sistema funcionará en **modo desarrollo**. Los códigos se mostrarán en la consola del servidor en lugar de enviarse por correo:

```
📧 CÓDIGO DE VERIFICACIÓN (Modo desarrollo)
====================================
 📨 Para: juan.perez@example.com
👤 Nombre: Juan Carlos Pérez
🔐 Código: 123456
====================================
```

## 🌐 Alternativas a Gmail

Si prefieres no usar Gmail, puedes configurar otros servicios:

### Outlook/Hotmail

```env
EMAIL_SERVICE=outlook
EMAIL_USER=tu_correo@outlook.com
EMAIL_PASSWORD=tu_contraseña
```

Y modifica `emailService.js`:

```javascript
return nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### SendGrid (Recomendado para producción)

1. Crea una cuenta en [SendGrid](https://sendgrid.com/)
2. Obtén tu API Key
3. Instala el paquete: `npm install @sendgrid/mail`
4. Modifica el servicio de email para usar SendGrid

### SMTP Personalizado

```javascript
return nodemailer.createTransporter({
  host: "smtp.tuservidor.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## 📝 Datos de Prueba

Usuarios disponibles para testing (después de ejecutar `npm run seed:votantes`):

| Carnet   | Fecha Nacimiento | Email                      |
| -------- | ---------------- | -------------------------- |
| 13120200 | 08/06/2004       | juan.perez@example.com     |
| 12735190 | 07/01/2004       | maria.flores@example.com   |
| 8466316  | 19/08/2003       | pedro.gonzalez@example.com |

**Nota:** Para que los correos se envíen a direcciones reales, edita el archivo `backendBait/scripts/seedVotantes.js` y cambia los correos de ejemplo por correos reales.

## 🔒 Seguridad

**IMPORTANTE:** El archivo `.env` contiene información sensible.

- ✅ El archivo `.env` está en `.gitignore` por defecto
- ❌ **NUNCA** subas el archivo `.env` a GitHub o repositorios públicos
- ✅ Usa contraseñas de aplicación, no tu contraseña personal de Gmail
- ✅ En producción, usa variables de entorno del servidor (Heroku, AWS, etc.)

## 📚 Recursos Adicionales

- [Documentación de Nodemailer](https://nodemailer.com/)
- [Contraseñas de aplicaciones de Google](https://support.google.com/accounts/answer/185833)
- [Guía de SendGrid](https://docs.sendgrid.com/)

## 💡 Consejos

1. **Para desarrollo**: Usa [Mailtrap](https://mailtrap.io/) - un servicio que atrapa los correos sin enviarlos realmente
2. **Para testing**: Cambia los emails en el seeder a uno de tu propiedad para recibir los códigos
3. **Para producción**: Considera usar un servicio dedicado como SendGrid, AWS SES, o Mailgun

¿Necesitas ayuda? Revisa los logs del servidor para más detalles sobre errores.
