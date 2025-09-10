package com.votaciones.usuarios.controller;

import com.votaciones.usuarios.dto.UsuarioCreacionDto;
import com.votaciones.usuarios.dto.UsuarioDto;
import com.votaciones.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador REST para la gestión de usuarios en el sistema de votaciones bolivianas
 */
@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuario", description = "API REST para la gestión de usuarios del sistema de votaciones bolivianas")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario en el sistema de votaciones")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "409", description = "Email o carnet ya existe")
    })
    @PostMapping
    public ResponseEntity<UsuarioDto> crearUsuario(
            @Valid @RequestBody UsuarioCreacionDto dto) {
        UsuarioDto creado = usuarioService.crearUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(summary = "Obtener usuario por ID", description = "Obtiene un usuario específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> obtenerUsuario(
            @Parameter(description = "ID del usuario", example = "1", required = true) 
            @PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @Operation(summary = "Listar todos los usuarios", description = "Obtiene la lista completa de usuarios registrados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    })
    @GetMapping
    public ResponseEntity<List<UsuarioDto>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    @Operation(summary = "Buscar usuarios por departamento", description = "Obtiene usuarios filtrados por departamento")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuarios del departamento obtenida exitosamente")
    })
    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<List<UsuarioDto>> buscarPorDepartamento(
            @Parameter(description = "Nombre del departamento", example = "La Paz", required = true)
            @PathVariable String departamento) {
        return ResponseEntity.ok(usuarioService.buscarPorDepartamento(departamento));
    }
}

