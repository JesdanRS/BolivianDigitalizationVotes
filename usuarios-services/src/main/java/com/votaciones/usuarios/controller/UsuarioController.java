package com.votaciones.usuarios.controller;

import com.votaciones.usuarios.dto.LoginRequestDto;
import com.votaciones.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios") // Ruta base para todos los endpoints de este controlador
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        usuarioService.autenticarUsuario(loginRequestDto);
        // TODO: Aquí devolveríamos el token JWT en la respuesta. Por ahora, un 200 OK.
        return ResponseEntity.ok().build();
    }
    
}
