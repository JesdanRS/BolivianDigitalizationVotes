package com.votaciones.usuarios.controller;

import com.votaciones.usuarios.dto.*;
import com.votaciones.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/") // Ruta base para todos los endpoints
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Endpoint para autenticar a un usuario.
     * HTTP Method: POST
     * URL: /api/usuarios/login
     */
    @PostMapping("/login")
    public ResponseEntity<UsuarioDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        UsuarioDto usuarioDto = usuarioService.autenticarUsuario(loginRequestDto);
        // En el futuro, aquí se generaría un token JWT y se devolvería en la respuesta.
        return ResponseEntity.ok(usuarioDto);
    }

    /**
     * Endpoint para solicitar un código de verificación por correo.
     * Asumimos que el usuario ya está autenticado.
     * HTTP Method: POST
     * URL: /api/usuarios/{carnet}/solicitar-codigo
     */
    @PostMapping("/{carnet}/solicitar-codigo")
    public ResponseEntity<Void> solicitarCodigo(@PathVariable String carnet, @Valid @RequestBody SolicitudCodigoDto solicitudDto) {
        // NOTA: En una aplicación real, el 'carnet' se obtendría del token de seguridad del usuario autenticado,
        // no de la URL, para evitar que un usuario pida códigos para otro. Por ahora, esto es funcional.
        usuarioService.solicitarCodigoVerificacion(carnet, solicitudDto.getCorreoElectronico());
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para verificar el código enviado al correo.
     * HTTP Method: POST
     * URL: /api/usuarios/{carnet}/verificar-codigo
     */
    @PostMapping("/{carnet}/verificar-codigo")
    public ResponseEntity<Void> verificarCodigo(@PathVariable String carnet, @Valid @RequestBody VerificacionCodigoDto verificacionDto) {
        usuarioService.verificarCodigo(carnet, verificacionDto.getCodigo());
        return ResponseEntity.ok().build();
    }
    
    /**
     * Endpoint para obtener el perfil de un usuario por su ID.
     * HTTP Method: GET
     * URL: /api/usuarios/perfil/{id}
     */
    @GetMapping("/perfil/{id}")
    public ResponseEntity<UsuarioDto> obtenerPerfil(@PathVariable Long id) {
        UsuarioDto usuarioDto = usuarioService.obtenerPerfilUsuario(id);
        return ResponseEntity.ok(usuarioDto);
    }

    /**
     * Endpoint para la carga masiva de usuarios.
     * ¡¡¡IMPORTANTE!!! Este endpoint debe estar protegido y solo ser accesible por administradores.
     * HTTP Method: POST
     * URL: /api/usuarios/carga-masiva
     */
    @PostMapping("/carga-masiva")
    public ResponseEntity<String> cargaMasiva(@RequestBody List<UsuarioCargaDto> usuarios) {
        int numeroCargados = usuarioService.cargarUsuariosMasivamente(usuarios);
        return ResponseEntity.ok("Carga masiva completada. Se insertaron " + numeroCargados + " usuarios nuevos.");
    }
}