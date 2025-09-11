package com.votacion.votaciones.controller;

import com.votacion.votaciones.dto.VotacionCreacionDto;
import com.votacion.votaciones.dto.VotacionDto;
import com.votacion.votaciones.service.VotacionService;
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
 * Controlador REST para la gestión de votaciones en el sistema de votaciones bolivianas
 */
@RestController
@RequestMapping("/votaciones")
@Tag(name = "Votacion", description = "API REST para la gestión de votaciones del sistema de votaciones bolivianas")
public class VotacionController {

    @Autowired
    private VotacionService votacionService;

    @Operation(summary = "Registrar votación", description = "Registra una nueva votación en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Votación registrada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "409", description = "El votante ya ha emitido su voto")
    })
    @PostMapping
    public ResponseEntity<VotacionDto> registrarVotacion(
            @Valid @RequestBody VotacionCreacionDto dto) {
        VotacionDto creado = votacionService.registrarVotacion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(summary = "Obtener votación por ID", description = "Obtiene una votación específica por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Votación encontrada"),
        @ApiResponse(responseCode = "404", description = "Votación no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VotacionDto> obtenerVotacion(
            @Parameter(description = "ID de la votación", example = "1", required = true) 
            @PathVariable Long id) {
        VotacionDto votacion = votacionService.obtenerVotacionPorId(id);
        return ResponseEntity.ok(votacion);
    }

    @Operation(summary = "Obtener todas las votaciones", description = "Obtiene la lista de todas las votaciones registradas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de votaciones obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<List<VotacionDto>> obtenerTodasLasVotaciones() {
        List<VotacionDto> votaciones = votacionService.obtenerTodasLasVotaciones();
        return ResponseEntity.ok(votaciones);
    }

    @Operation(summary = "Verificar votación", description = "Marca una votación como verificada")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Votación verificada correctamente"),
        @ApiResponse(responseCode = "404", description = "Votación no encontrada")
    })
    @PatchMapping("/{id}/verificar")
    public ResponseEntity<VotacionDto> verificarVotacion(
            @Parameter(description = "ID de la votación", example = "1", required = true) 
            @PathVariable Long id) {
        VotacionDto votacion = votacionService.verificarVotacion(id);
        return ResponseEntity.ok(votacion);
    }

    @Operation(summary = "Obtener votaciones por departamento", description = "Obtiene la lista de votaciones de un departamento específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de votaciones obtenida correctamente")
    })
    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<List<VotacionDto>> obtenerVotacionesPorDepartamento(
            @Parameter(description = "Nombre del departamento", example = "La Paz", required = true) 
            @PathVariable String departamento) {
        List<VotacionDto> votaciones = votacionService.obtenerVotacionesPorDepartamento(departamento);
        return ResponseEntity.ok(votaciones);
    }

    @Operation(summary = "Obtener votaciones por mesa", description = "Obtiene la lista de votaciones de una mesa específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de votaciones obtenida correctamente")
    })
    @GetMapping("/mesa/{mesaVotacion}")
    public ResponseEntity<List<VotacionDto>> obtenerVotacionesPorMesa(
            @Parameter(description = "Número o identificador de la mesa", example = "Mesa 123", required = true) 
            @PathVariable String mesaVotacion) {
        List<VotacionDto> votaciones = votacionService.obtenerVotacionesPorMesa(mesaVotacion);
        return ResponseEntity.ok(votaciones);
    }

    @Operation(summary = "Obtener votaciones por recinto", description = "Obtiene la lista de votaciones de un recinto específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de votaciones obtenida correctamente")
    })
    @GetMapping("/recinto/{recinto}")
    public ResponseEntity<List<VotacionDto>> obtenerVotacionesPorRecinto(
            @Parameter(description = "Nombre del recinto", example = "Unidad Educativa Simón Bolívar", required = true) 
            @PathVariable String recinto) {
        List<VotacionDto> votaciones = votacionService.obtenerVotacionesPorRecinto(recinto);
        return ResponseEntity.ok(votaciones);
    }
}