package com.votaciones.usuarios.controller;

import com.votaciones.usuarios.dto.*;
import com.votaciones.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios") // Ruta base para todos los endpoints
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Endpoint principal de autenticación para el frontend.
     * Autentica al usuario y envía automáticamente un código de verificación a su
     * correo.
     * HTTP Method: POST
     * URL: /api/usuarios/auth/login
     */
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponseDto> loginConVerificacion(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        AuthResponseDto response = usuarioService.autenticarYEnviarCodigo(loginRequestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint legacy para autenticar a un usuario (sin enviar código
     * automáticamente).
     * HTTP Method: POST
     * URL: /api/usuarios/login
     */
    @PostMapping("/login")
    public ResponseEntity<UsuarioDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        UsuarioDto usuarioDto = usuarioService.autenticarUsuario(loginRequestDto);
        return ResponseEntity.ok(usuarioDto);
    }

    /**
     * Endpoint para solicitar un código de verificación por correo.
     * Asumimos que el usuario ya está autenticado.
     * HTTP Method: POST
     * URL: /api/usuarios/{carnet}/solicitar-codigo
     */
    @PostMapping("/{carnet}/solicitar-codigo")
    public ResponseEntity<Void> solicitarCodigo(@PathVariable String carnet) {
        usuarioService.solicitarCodigoVerificacion(carnet);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para verificar el código enviado al correo.
     * Devuelve los datos del usuario si el código es correcto.
     * HTTP Method: POST
     * URL: /api/usuarios/{carnet}/verificar-codigo
     */
    @PostMapping("/{carnet}/verificar-codigo")
    public ResponseEntity<UsuarioDto> verificarCodigo(@PathVariable String carnet,
            @Valid @RequestBody VerificacionCodigoDto verificacionDto) {
        UsuarioDto usuario = usuarioService.verificarCodigoYObtenerUsuario(carnet, verificacionDto.getCodigo());
        return ResponseEntity.ok(usuario);
    }

    /**
     * Endpoint para obtener todos los usuarios.
     * Requiere autenticación con token JWT.
     * HTTP Method: GET
     * URL: /api/usuarios
     */
    @GetMapping
    public ResponseEntity<List<UsuarioDto>> obtenerTodosUsuarios() {
        List<UsuarioDto> usuarios = usuarioService.obtenerTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Endpoint para obtener un usuario por ID.
     * HTTP Method: GET
     * URL: /api/usuarios/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> obtenerUsuarioPorId(@PathVariable Long id) {
        UsuarioDto usuarioDto = usuarioService.obtenerPerfilUsuario(id);
        return ResponseEntity.ok(usuarioDto);
    }

    /**
     * Endpoint para la carga masiva de usuarios.
     * ¡¡¡IMPORTANTE!!! Este endpoint requiere autenticación JWT con rol ADMIN.
     * Debe incluir el header: Authorization: Bearer <token_jwt>
     * HTTP Method: POST
     * URL: /api/usuarios/carga-masiva
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/carga-masiva")
    public ResponseEntity<String> cargaMasiva(@RequestBody List<UsuarioCargaDto> usuarios) {
        int numeroCargados = usuarioService.cargarUsuariosMasivamente(usuarios);
        return ResponseEntity.ok("Carga masiva completada. Se insertaron " + numeroCargados + " usuarios nuevos.");
    }

    /**
     * Endpoint interno para marcar que un usuario ha votado.
     * Debería ser llamado por el microservicio de votaciones.
     * HTTP Method: POST
     * URL: /api/usuarios/{carnet}/marcar-votado
     */
    @PostMapping("/{carnet}/marcar-votado")
    public ResponseEntity<Void> marcarUsuarioComoVotado(@PathVariable String carnet) {
        usuarioService.marcarUsuarioComoVotado(carnet);
        return ResponseEntity.ok().build();
    }
}