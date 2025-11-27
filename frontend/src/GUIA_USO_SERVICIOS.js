// =================================================================
// GUÍA RÁPIDA: Integración Backend-Frontend con Keycloak
// =================================================================

// ============================================================
// 1. OBTENER TOKENS DE KEYCLOAK POR ROL
// ============================================================

import { getTokenByRole, getValidToken, clearToken } from './services/keycloakService';

// Obtener token para un rol específico (se guarda automáticamente en localStorage)
const obtenerTokenPorRol = async () => {
    try {
        // Obtener token para USER
        const tokenUser = await getTokenByRole('USER');
        console.log('Token USER:', tokenUser.accessToken);

        // Obtener token para AUDITOR
        const tokenAuditor = await getTokenByRole('AUDITOR');
        console.log('Token AUDITOR:', tokenAuditor.accessToken);

        // Obtener token para ADMIN
        const tokenAdmin = await getTokenByRole('ADMIN');
        console.log('Token ADMIN:', tokenAdmin.accessToken);

    } catch (error) {
        console.error('Error al obtener token:', error);
    }
};

// ============================================================
// 2. USAR EL TOKEN EN TUS COMPONENTES
// ============================================================

import { useAuth } from './context/AuthContext';

const MiComponente = () => {
    const { loginWithKeycloak, keycloakToken, hasActiveSession } = useAuth();

    const handleLogin = async (role) => {
        try {
            await loginWithKeycloak(role); // 'USER', 'AUDITOR', o 'ADMIN'
            console.log('Login exitoso con rol:', role);
        } catch (error) {
            console.error('Error en login:', error);
        }
    };

    return (
        <div>
            <button onClick={() => handleLogin('USER')}>Login como Usuario</button>
            <button onClick={() => handleLogin('AUDITOR')}>Login como Auditor</button>
            <button onClick={() => handleLogin('ADMIN')}>Login como Admin</button>

            {hasActiveSession && <p>Sesión activa con token válido</p>}
        </div>
    );
};

// ============================================================
// 3. LLAMAR A LOS ENDPOINTS DEL BACKEND
// ============================================================

// Los servicios ya están configurados para usar el token automáticamente
// NO necesitas añadir manualmente el header Authorization

// --- CANDIDATOS ---
import * as candidatosService from './services/candidatosService';

const usarCandidatos = async () => {
    try {
        // Listar todos los candidatos
        const candidatos = await candidatosService.listarCandidatos();

        // Obtener un candidato específico
        const candidato = await candidatosService.obtenerCandidato(1);

        // Crear un nuevo candidato
        const nuevoCandidato = await candidatosService.crearCandidato({
            nombre: 'Juan Pérez',
            partido: 'Partido Verde',
            ciUsuario: '12345678'
        });

        // Actualizar candidato
        const actualizado = await candidatosService.actualizarCandidato(1, {
            nombre: 'Juan Pérez Actualizado'
        });

        // Eliminar candidato
        await candidatosService.eliminarCandidato(1, '12345678');

    } catch (error) {
        console.error('Error:', error);
    }
};

// --- USUARIOS ---
import * as usuariosService from './services/userService';

const usarUsuarios = async () => {
    try {
        // Login
        const usuario = await usuariosService.login({
            carnet: '13120200',
            fechaNacimiento: '08/06/2004'
        });

        // Solicitar código de verificación
        await usuariosService.solicitarCodigo('13120200');

        // Verificar código
        await usuariosService.verificarCodigo('13120200', '123456');

        // Obtener perfil
        const perfil = await usuariosService.obtenerPerfil(1);

        // Carga masiva (requiere ADMIN)
        await usuariosService.cargaMasiva([
            { carnet: '123', nombre: 'Usuario 1', email: 'user1@mail.com' }
        ]);

    } catch (error) {
        console.error('Error:', error);
    }
};

// --- VOTACIONES ---
import * as votacionesService from './services/votacionService';

const usarVotaciones = async () => {
    try {
        // Crear votación (requiere ADMIN)
        const votacion = await votacionesService.crearVotacion({
            localidad: 'La Paz',
            fecha: '2025-12-01'
        });

        // Listar votaciones
        const votaciones = await votacionesService.listarVotaciones();

        // Obtener votación por ID
        const votacionDetalle = await votacionesService.obtenerVotacion(1);

        // Buscar por localidad
        const votacionesLaPaz = await votacionesService.buscarVotacionesPorLocalidad('La Paz');

    } catch (error) {
        console.error('Error:', error);
    }
};

// --- RESULTADOS ---
import * as resultadosService from './services/resultadosService';

const usarResultados = async () => {
    try {
        // Listar todos los resultados
        const resultados = await resultadosService.listarResultados();

        // Obtener resultado por ID
        const resultado = await resultadosService.obtenerResultado(1);

        // Listar por departamento
        const resultadosLaPaz = await resultadosService.listarResultadosPorDepartamento('La Paz');

        // Listar por municipio
        const resultadosMunicipio = await resultadosService.listarResultadosPorMunicipio('Murillo');

        // Crear resultado
        const nuevoResultado = await resultadosService.crearResultado({
            departamento: 'La Paz',
            municipio: 'Murillo',
            votos: 1000
        });

        // Obtener estadísticas
        const estadisticas = await resultadosService.obtenerEstadisticas();

        // Obtener estadística de un departamento
        const estadisticaLaPaz = await resultadosService.obtenerEstadisticaDepartamento('La Paz');

    } catch (error) {
        console.error('Error:', error);
    }
};

// --- AUDITORÍA ---
import * as auditoriaService from './services/auditoriaService';

const usarAuditoria = async () => {
    try {
        // Crear registro de auditoría
        const registro = await auditoriaService.crearRegistro({
            tipo: 'LOGIN',
            modulo: 'usuarios',
            severidad: 'INFO',
            usuario: '12345678',
            detalle: 'Usuario inició sesión'
        });

        // Obtener todos los registros
        const registros = await auditoriaService.obtenerRegistros();

        // Filtrar por usuario
        const registrosUsuario = await auditoriaService.obtenerPorUsuario('12345678');

        // Filtrar por tipo
        const registrosLogin = await auditoriaService.obtenerPorTipo('LOGIN');

        // Obtener KPIs
        const kpis = await auditoriaService.obtenerKpis();

        // Filtrar con múltiples criterios
        const filtrados = await auditoriaService.filtrar({
            tipo: 'LOGIN',
            severidad: 'INFO',
            modulo: 'usuarios'
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

// ============================================================
// 4. MANEJO DE ERRORES
// ============================================================

const manejarLlamadaAPI = async () => {
    try {
        const candidatos = await candidatosService.listarCandidatos();
        console.log('Candidatos:', candidatos);
    } catch (error) {
        // El error ya viene formateado por handleApiError
        if (error.status === 401) {
            console.error('No autorizado - token inválido o expirado');
            // El sistema intentará refrescar el token automáticamente
        } else if (error.status === 403) {
            console.error('Acceso denegado - sin permisos');
        } else if (error.status === 0) {
            console.error('No se pudo conectar al servidor');
            console.error('Verifica que Docker esté ejecutando los servicios');
        } else {
            console.error('Error:', error.message);
        }
    }
};

// ============================================================
// 5. VERIFICAR ANTES DE USAR
// ============================================================

// IMPORTANTE: Antes de usar estos servicios, asegúrate de que:
// 1. Docker esté ejecutando todos los servicios (docker-compose up)
// 2. Keycloak esté disponible en http://localhost:8090
// 3. API Gateway esté disponible en http://localhost:8080
// 4. Eureka Server esté disponible en http://localhost:8761

// Para verificar:
// - Keycloak: http://localhost:8090
// - API Gateway: http://localhost:8080/actuator/health
// - Eureka: http://localhost:8761

// ============================================================
// 6. URLS DE LOS ENDPOINTS
// ============================================================

// Gateway base: http://localhost:8080

// Candidatos:    /ms-candidatos/api/candidatos
// Usuarios:      /api/usuarios
// Votaciones:    /api/votaciones
// Resultados:    /api/resultados/resultados
// Auditoría:     /api/auditoria

// ============================================================
// 7. COMPONENTE DE EJEMPLO COMPLETO
// ============================================================

// Ver: frontend/src/components/examples/KeycloakTokenExample.jsx
// Este componente muestra cómo usar los servicios de Keycloak

export {
    obtenerTokenPorRol,
    usarCandidatos,
    usarUsuarios,
    usarVotaciones,
    usarResultados,
    usarAuditoria,
    manejarLlamadaAPI
};
