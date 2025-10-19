package com.votaciones.usuarios.service;

import com.votaciones.usuarios.dto.LoginRequestDto;
import com.votaciones.usuarios.dto.UsuarioCargaDto;
import com.votaciones.usuarios.dto.UsuarioDto;
import com.votaciones.usuarios.exception.CredencialesInvalidasException;
import com.votaciones.usuarios.exception.OperacionInvalidaException; // <-- Crea esta nueva excepción
import com.votaciones.usuarios.exception.RecursoNoEncontradoException;
import com.votaciones.usuarios.mapper.UsuarioMapper;
import com.votaciones.usuarios.model.Usuario;
import com.votaciones.usuarios.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final UsuarioMapper usuarioMapper; // <-- Inyecta el mapper

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    /**
     * Autentica a un usuario basado en su carnet y fecha de nacimiento.
     * @param loginRequest DTO con las credenciales.
     * @return El DTO del usuario si la autenticación es exitosa.
     */
    
    @Transactional(readOnly = true) // Transacción de solo lectura, es más eficiente.
    public UsuarioDto autenticarUsuario(LoginRequestDto loginRequest) {
        log.info("Intento de autenticacion para el carnet: {}", loginRequest.getCarnet());

        Usuario usuario = usuarioRepository.findByCarnet(loginRequest.getCarnet())
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con el carnet: " + loginRequest.getCarnet()));

            if(!loginRequest.getFechaNacimiento().equals(usuario.getFechaNacimiento())){
                log.warn("Credenciales invalidas para el carnet: {}. Fecha de nacimiento no coincide.", loginRequest.getCarnet());
                throw new CredencialesInvalidasException("Las credenciales ingresadas son invalidas.");
            }

            log.info("Autenticacion exitosa para el usuario con ID: {}", usuario.getId());

            // FUTURO: Aquí generarías y devolverías un token JWT.
            // Por ahora, devolvemos los datos del usuario para confirmar el éxito.
            return usuarioMapper.toDto(usuario);
    }   

     /**
     * Genera y asigna un código de verificación a un usuario para su correo electrónico.
     * @param carnet El carnet del usuario autenticado.
     * @param correo El correo a verificar y donde se enviará el código.
     */

    @Transactional // Transacción de escritura, ya que modificamos el usuario.
    public void solicitarCodigoVerificacion(String carnet, String correo) {
        log.info("Solicitud de codigo de verificacion para el carnet: {} y correo {}", carnet, correo);
        Usuario usuario = usuarioRepository.findByCarnet(carnet)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));
            
        // Genera un código de 6 dígitos (ej. "051234")
        String codigo = String.format("%06d", ThreadLocalRandom.current().nextInt(1000000));

        usuario.setCorreoElectronico(correo);
        usuario.setCodigoVerificacion(codigo);
        usuario.setCodigoExpiracion(Instant.now().plus(10, ChronoUnit.MINUTES)); // Código válido por 10 minutos
        usuario.setCorreoVerificado(false); // Se marca como no verificado hasta que se confirme el código

        usuarioRepository.save(usuario); // Guarda los cambios
        // TODO: Aquí es donde te comunicarías con el 'notificaciones-service'.
        // Publicarías un evento en Kafka/RabbitMQ con (usuarioId, correo, codigo)
        // para que el otro microservicio se encargue de enviar el email.
        log.info("Código de verificación generado para el usuario {}. Desencadenando notificación.", usuario.getId());
    }

     /**
     * Verifica el código proporcionado por el usuario.
     * @param carnet El carnet del usuario.
     * @param codigo El código de 6 dígitos.
     */

    @Transactional // Transacción de escritura, ya que modificamos el usuario.
    public void verificarCodigo(String carnet, String codigo) {
        log.info("Intento de verificacion de codigo para el carnet: {}", carnet);
        Usuario usuario = usuarioRepository.findByCarnet(carnet)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));

        if (usuario.getCodigoVerificacion() == null || usuario.getCodigoExpiracion() == null) {
            throw new OperacionInvalidaException("No hay un código de verificación pendiente para este usuario.");
        }

         if (Instant.now().isAfter(usuario.getCodigoExpiracion())) {
            throw new CredencialesInvalidasException("El código de verificación ha expirado.");
        }

        if (!usuario.getCodigoVerificacion().equals(codigo)) {
            throw new CredencialesInvalidasException("El código de verificación es incorrecto.");
        }

        // ¡Éxito! Marcamos el correo como verificado y limpiamos los campos del código.
        usuario.setCorreoVerificado(true);
        usuario.setCodigoVerificacion(null);
        usuario.setCodigoExpiracion(null);
        usuarioRepository.save(usuario);
        log.info("Correo verificado exitosamente para el usuario {}", usuario.getId());
    }

     /**
     * Carga una lista de usuarios en la base de datos, ignorando los que ya existen.
     * (Endpoint para ser usado por un administrador).
     * @param usuariosACargar Lista de DTOs de carga.
     * @return El número de usuarios nuevos que fueron insertados.
     */

    @Transactional
    public int cargarUsuariosMasivamente(List<UsuarioCargaDto> usuariosACargar) {
        log.info("Recibida solicitud para cargar {} usuarios.", usuariosACargar.size());
        
        List<Usuario> nuevosUsuarios = usuariosACargar.stream()
                .filter(dto -> !usuarioRepository.findByCarnet(dto.getCarnet()).isPresent()) // Filtra los que ya existen
                .map(usuarioMapper::toEntity) // Convierte los DTOs restantes a Entidades
                .toList();

        if (nuevosUsuarios.isEmpty()) {
            log.info("No se encontraron usuarios nuevos para cargar.");
            return 0;
        }

        usuarioRepository.saveAll(nuevosUsuarios);
        log.info("Se cargaron exitosamente {} nuevos usuarios.", nuevosUsuarios.size());
        return nuevosUsuarios.size();
    }

    @Transactional(readOnly = true)
    public UsuarioDto obtenerPerfilUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
        return usuarioMapper.toDto(usuario);
    }
}
