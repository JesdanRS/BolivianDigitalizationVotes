package com.votaciones.usuarios.service;

import com.votaciones.usuarios.auditoria.AuditoriaClient;

import com.votaciones.usuarios.dto.AuthResponseDto;
import com.votaciones.usuarios.dto.LoginRequestDto;
import com.votaciones.usuarios.dto.UsuarioCargaDto;
import com.votaciones.usuarios.dto.UsuarioDto;
import com.votaciones.usuarios.exception.CredencialesInvalidasException;
import com.votaciones.usuarios.exception.OperacionInvalidaException;
import com.votaciones.usuarios.exception.RecursoNoEncontradoException;
import com.votaciones.usuarios.mapper.UsuarioMapper;
import com.votaciones.usuarios.model.Usuario;
import com.votaciones.usuarios.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Slf4j

public class UsuarioService {

        private final UsuarioRepository usuarioRepository;
        private final UsuarioMapper usuarioMapper;
        private final StreamBridge streamBridge;
        private final AuditoriaClient auditoriaClient;

        @Autowired
        public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper,
                        StreamBridge streamBridge,
                        AuditoriaClient auditoriaClient) {
                this.usuarioRepository = usuarioRepository;
                this.usuarioMapper = usuarioMapper;
                this.streamBridge = streamBridge;
                this.auditoriaClient = auditoriaClient;
        }

        /**
         * Autentica a un usuario basado en su carnet y fecha de nacimiento.
         * 
         * @param loginRequest DTO con las credenciales.
         * @return El DTO del usuario si la autenticación es exitosa.
         */

        @Transactional(readOnly = true) // Transacción de solo lectura, es más eficiente.
        public UsuarioDto autenticarUsuario(LoginRequestDto loginRequest) {
                log.info("Intento de autenticacion para el carnet: {}", loginRequest.getCarnet());

                Usuario usuario = usuarioRepository.findByCarnet(loginRequest.getCarnet())
                                .orElse(null);

                if (usuario == null) {
                        log.warn("Login fallido. Usuario no encontrado para carnet {}", loginRequest.getCarnet());
                        auditoriaClient.registrarEvento(
                                        "LOGIN_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        loginRequest.getCarnet(),
                                        "Intento de login con carnet no registrado");
                        throw new RecursoNoEncontradoException(
                                        "Usuario no encontrado con el carnet: " + loginRequest.getCarnet());
                }

                if (!loginRequest.getFechaNacimiento().equals(usuario.getFechaNacimiento())) {
                        log.warn("Credenciales invalidas para el carnet: {}. Fecha de nacimiento no coincide.",
                                        loginRequest.getCarnet());

                        auditoriaClient.registrarEvento(
                                        "LOGIN_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        loginRequest.getCarnet(),
                                        "Fecha de nacimiento no coincide");

                        throw new CredencialesInvalidasException("Las credenciales ingresadas son invalidas.");
                }

                log.info("Autenticacion exitosa para el usuario con ID: {}", usuario.getId());

                auditoriaClient.registrarEvento(
                                "LOGIN",
                                "INFO",
                                "Usuarios",
                                loginRequest.getCarnet(),
                                "Autenticación exitosa");

                // FUTURO: Aquí generarías y devolverías un token JWT.
                // Por ahora, devolvemos los datos del usuario para confirmar el éxito.
                return usuarioMapper.toDto(usuario);
        }

        /**
         * Autentica al usuario y envía automáticamente un código de verificación.
         * Este método combina la autenticación con el envío del código para el flujo
         * frontend.
         * 
         * @param loginRequest DTO con carnet y fecha de nacimiento.
         * @return AuthResponseDto con email oculto y estado.
         */
        @Transactional
        public AuthResponseDto autenticarYEnviarCodigo(LoginRequestDto loginRequest) {
                log.info("Login con verificación para carnet: {}", loginRequest.getCarnet());

                // 1. Autenticar usuario
                Usuario usuario = usuarioRepository.findByCarnet(loginRequest.getCarnet())
                                .orElse(null);

                if (usuario == null) {
                        log.warn("Login fallido. Usuario no encontrado para carnet {}", loginRequest.getCarnet());
                        auditoriaClient.registrarEvento(
                                        "LOGIN_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        loginRequest.getCarnet(),
                                        "Carnet no registrado");
                        throw new RecursoNoEncontradoException("Usuario no encontrado");
                }

                if (!loginRequest.getFechaNacimiento().equals(usuario.getFechaNacimiento())) {
                        log.warn("Credenciales inválidas para carnet: {}", loginRequest.getCarnet());
                        auditoriaClient.registrarEvento(
                                        "LOGIN_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        loginRequest.getCarnet(),
                                        "Fecha de nacimiento incorrecta");
                        throw new CredencialesInvalidasException("Credenciales inválidas");
                }

                // 2. Verificar que tenga correo
                if (usuario.getCorreoElectronico() == null || usuario.getCorreoElectronico().isBlank()) {
                        auditoriaClient.registrarEvento(
                                        "LOGIN_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        loginRequest.getCarnet(),
                                        "Usuario sin correo registrado");
                        throw new OperacionInvalidaException("El usuario no tiene correo electrónico registrado");
                }

                // 3. Generar y enviar código
                String codigo = String.format("%06d", ThreadLocalRandom.current().nextInt(1000000));
                usuario.setCodigoVerificacion(codigo);
                usuario.setCodigoExpiracion(Instant.now().plus(10, ChronoUnit.MINUTES));
                usuario.setCorreoVerificado(false);
                usuarioRepository.save(usuario);

                // 4. Enviar notificación vía Kafka
                var notificacion = new com.votaciones.notificaciones.dto.NotificacionDto(
                                usuario.getCorreoElectronico(),
                                "Tu Código de Verificación - Sistema de Votaciones",
                                "Hola " + usuario.getNombreCompleto() + ",\n\n" +
                                                "Tu código de verificación es: " + codigo + "\n\n" +
                                                "Este código expira en 10 minutos.\n\n" +
                                                "Si no solicitaste este código, ignora este mensaje.");

                streamBridge.send("enviarNotificacion-out-0", notificacion);

                log.info("Código de verificación enviado para usuario {}", usuario.getCarnet());
                auditoriaClient.registrarEvento(
                                "LOGIN_CODIGO_ENVIADO",
                                "INFO",
                                "Usuarios",
                                loginRequest.getCarnet(),
                                "Código de verificación enviado");

                // 5. Devolver respuesta con email oculto
                return AuthResponseDto.builder()
                                .success(true)
                                .emailOculto(ocultarEmail(usuario.getCorreoElectronico()))
                                .carnet(usuario.getCarnet())
                                .message("Código de verificación enviado a tu correo")
                                .build();
        }

        /**
         * Oculta parte del email para mostrar al usuario.
         * Ejemplo: "juan@email.com" -> "j***@email.com"
         */
        private String ocultarEmail(String email) {
                if (email == null || !email.contains("@"))
                        return email;
                String[] partes = email.split("@");
                String usuario = partes[0];
                String dominio = partes[1];
                String usuarioOculto = usuario.charAt(0) + "***";
                return usuarioOculto + "@" + dominio;
        }

        /**
         * Genera y asigna un código de verificación a un usuario para su correo
         * electrónico.
         * 
         * @param carnet El carnet del usuario autenticado.
         * @param correo El correo a verificar y donde se enviará el código.
         */

        @Transactional
        // ¡CAMBIO! El método ya no acepta un 'correo' como parámetro
        public void solicitarCodigoVerificacion(String carnet) {
                log.info("Solicitud de codigo de verificacion para el carnet: {}", carnet);
                Usuario usuario = usuarioRepository.findByCarnet(carnet)
                                .orElse(null);

                if (usuario == null) {
                        auditoriaClient.registrarEvento(
                                        "SOLICITAR_CODIGO_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        carnet,
                                        "Intento de solicitar código para usuario no existente");
                        throw new RecursoNoEncontradoException("Usuario no encontrado.");
                }

                // ¡NUEVA VALIDACIÓN!
                // Verificamos si el usuario tiene un correo registrado antes de continuar.
                if (usuario.getCorreoElectronico() == null || usuario.getCorreoElectronico().isBlank()) {
                        auditoriaClient.registrarEvento(
                                        "SOLICITAR_CODIGO_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        carnet,
                                        "Usuario sin correo electrónico registrado");
                        throw new OperacionInvalidaException(
                                        "El usuario no tiene un correo electrónico registrado para enviar el código.");
                }

                String codigo = String.format("%06d", ThreadLocalRandom.current().nextInt(1000000));

                // Ya no hacemos usuario.setCorreoElectronico(), porque ya lo tiene.
                usuario.setCodigoVerificacion(codigo);
                usuario.setCodigoExpiracion(Instant.now().plus(10, ChronoUnit.MINUTES));
                usuario.setCorreoVerificado(false);

                usuarioRepository.save(usuario);

                var notificacion = new com.votaciones.notificaciones.dto.NotificacionDto(
                                usuario.getCorreoElectronico(), // Usamos el correo de la BD
                                "Tu Código de Verificación para las Votaciones",
                                "Hola " + usuario.getNombreCompleto() + ",\n\nTu código de verificación es: " + codigo);

                streamBridge.send("enviarNotificacion-out-0", notificacion);

                log.info("Mensaje de notificación para el usuario {} enviado a Kafka.", usuario.getId());
                auditoriaClient.registrarEvento(
                                "SOLICITAR_CODIGO",
                                "INFO",
                                "Usuarios",
                                carnet,
                                "Código de verificación generado y enviado por correo");
        }

        /**
         * Verifica el código proporcionado por el usuario.
         * 
         * @param carnet El carnet del usuario.
         * @param codigo El código de 6 dígitos.
         */

        @Transactional // Transacción de escritura, ya que modificamos el usuario.
        public void verificarCodigo(String carnet, String codigo) {
                log.info("Intento de verificacion de codigo para el carnet: {}", carnet);
                Usuario usuario = usuarioRepository.findByCarnet(carnet)
                                .orElse(null);

                if (usuario == null) {
                        auditoriaClient.registrarEvento(
                                        "VERIFICAR_CODIGO_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        carnet,
                                        "Usuario no encontrado al verificar código");
                        throw new RecursoNoEncontradoException("Usuario no encontrado.");
                }

                if (usuario.getCodigoVerificacion() == null || usuario.getCodigoExpiracion() == null) {
                        auditoriaClient.registrarEvento(
                                        "VERIFICAR_CODIGO_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        carnet,
                                        "No hay código de verificación pendiente");
                        throw new OperacionInvalidaException(
                                        "No hay un código de verificación pendiente para este usuario.");
                }

                if (Instant.now().isAfter(usuario.getCodigoExpiracion())) {
                        auditoriaClient.registrarEvento(
                                        "VERIFICAR_CODIGO_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        carnet,
                                        "Código de verificación expirado");
                        throw new CredencialesInvalidasException("El código de verificación ha expirado.");
                }

                if (!usuario.getCodigoVerificacion().equals(codigo)) {
                        auditoriaClient.registrarEvento(
                                        "VERIFICAR_CODIGO_FALLIDO",
                                        "WARN",
                                        "Usuarios",
                                        carnet,
                                        "Código de verificación incorrecto");
                        throw new CredencialesInvalidasException("El código de verificación es incorrecto.");
                }

                // ¡Éxito! Marcamos el correo como verificado y limpiamos los campos del código.
                usuario.setCorreoVerificado(true);
                usuario.setCodigoVerificacion(null);
                usuario.setCodigoExpiracion(null);
                usuarioRepository.save(usuario);
                log.info("Correo verificado exitosamente para el usuario {}", usuario.getId());
                auditoriaClient.registrarEvento(
                                "VERIFICAR_CODIGO_OK",
                                "INFO",
                                "Usuarios",
                                carnet,
                                "Código de verificación correcto. Correo confirmado");
        }

        /**
         * Verifica el código de verificación y devuelve los datos del usuario.
         * Este método es usado por el frontend para completar el login.
         * 
         * @param carnet El carnet del usuario.
         * @param codigo El código de 6 dígitos.
         * @return UsuarioDto con los datos del usuario autenticado.
         */
        @Transactional
        public UsuarioDto verificarCodigoYObtenerUsuario(String carnet, String codigo) {
                // Reutilizamos la lógica de verificación existente
                verificarCodigo(carnet, codigo);

                // Obtener y devolver los datos del usuario
                Usuario usuario = usuarioRepository.findByCarnet(carnet)
                                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

                log.info("Login completado exitosamente para usuario {}", carnet);
                auditoriaClient.registrarEvento(
                                "LOGIN_COMPLETADO",
                                "INFO",
                                "Usuarios",
                                carnet,
                                "Usuario autenticado exitosamente con código de verificación");

                return usuarioMapper.toDto(usuario);
        }

        /**
         * Carga una lista de usuarios en la base de datos, ignorando los que ya
         * existen.
         * (Endpoint para ser usado por un administrador).
         * 
         * @param usuariosACargar Lista de DTOs de carga.
         * @return El número de usuarios nuevos que fueron insertados.
         */

        @Transactional
        public int cargarUsuariosMasivamente(List<UsuarioCargaDto> usuariosACargar) {
                log.info("Recibida solicitud para cargar {} usuarios.", usuariosACargar.size());

                List<Usuario> nuevosUsuarios = usuariosACargar.stream()
                                .filter(dto -> !usuarioRepository.findByCarnet(dto.getCarnet()).isPresent()) // Filtra
                                                                                                             // los que
                                                                                                             // ya
                                                                                                             // existen
                                .map(usuarioMapper::toEntity) // Convierte los DTOs restantes a Entidades
                                .toList();

                if (nuevosUsuarios.isEmpty()) {
                        log.info("No se encontraron usuarios nuevos para cargar.");
                        return 0;
                }

                usuarioRepository.saveAll(nuevosUsuarios);
                log.info("Se cargaron exitosamente {} nuevos usuarios.", nuevosUsuarios.size());

                auditoriaClient.registrarEvento(
                                "CARGA_MASIVA_USUARIOS",
                                "INFO",
                                "Usuarios",
                                "00000000", // TODO: reemplazar por CI del admin desde el JWT si lo mapeas en Keycloak
                                "Carga masiva de " + nuevosUsuarios.size() + " usuarios desde padrón electoral");
                return nuevosUsuarios.size();
        }

        @Transactional(readOnly = true)
        public UsuarioDto obtenerPerfilUsuario(Long id) {
                Usuario usuario = usuarioRepository.findById(id)
                                .orElseThrow(() -> new RecursoNoEncontradoException(
                                                "Usuario no encontrado con ID: " + id));
                return usuarioMapper.toDto(usuario);
        }

        /**
         * Obtiene todos los usuarios registrados en el sistema.
         * 
         * @return Lista de DTOs de usuarios.
         */
        @Transactional(readOnly = true)
        public List<UsuarioDto> obtenerTodosUsuarios() {
                log.info("Obteniendo lista de todos los usuarios");
                List<Usuario> usuarios = usuarioRepository.findAll();
                return usuarios.stream()
                                .map(usuarioMapper::toDto)
                                .toList();
        }
}
