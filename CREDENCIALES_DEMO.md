# CREDENCIALES DEMO - LOGIN ADMINISTRATIVO

## 🔐 Credenciales para la Demostración

### ADMIN

- **Carnet:** 12345678
- **Fecha Nacimiento:** 01/01/1990
- **Email:** admin@votaciones.bo
- **Password:** Admin123
- **Redirige a:** /admin/gestionar-candidatos

### JURADO

- **Carnet:** 87654321
- **Fecha Nacimiento:** 15/06/1985
- **Email:** jurado@votaciones.bo
- **Password:** Jurado123
- **Redirige a:** /jurado-espera

### AUDITOR

- **Carnet:** 11223344
- **Fecha Nacimiento:** 20/03/1988
- **Email:** auditor@votaciones.bo
- **Password:** Auditor123
- **Redirige a:** /auditoria

---

## ℹ️ Notas Técnicas

- El login hace una llamada al endpoint `/api/usuarios/auth/login` para que aparezca en los logs de Docker
- La autenticación es 100% hardcodeada para la demo (no depende del backend)
- Cada rol redirige automáticamente a su página correspondiente
- No hay validación real de seguridad (solo para demostración)
