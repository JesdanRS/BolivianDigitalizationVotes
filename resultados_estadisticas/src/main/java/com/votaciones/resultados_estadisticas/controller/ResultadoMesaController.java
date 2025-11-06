package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaCreacionDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaActualizacionDto;
import com.votaciones.resultados_estadisticas.service.ResultadoMesaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultados")
@RequiredArgsConstructor
@Tag(name = "Resultados Electorales", description = "API para gestión de resultados y estadísticas electorales")
public class ResultadoMesaController {

    private final ResultadoMesaService service;

    @Operation(summary = "Listar todos los resultados", description = "Obtiene todos los resultados electorales por mesa")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de resultados obtenida exitosamente",
            content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = ResultadoMesaDto.class))))
    })
    @GetMapping("/resultados")
    public ResponseEntity<List<ResultadoMesaDto>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Obtener resultado por ID", description = "Obtiene un resultado electoral específico por su ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resultado encontrado",
            content = @Content(schema = @Schema(implementation = ResultadoMesaDto.class))),
        @ApiResponse(responseCode = "404", description = "Resultado no encontrado")
    })
    @GetMapping("/resultados/{id}")
    public ResponseEntity<ResultadoMesaDto> obtenerPorId(
            @Parameter(description = "ID del resultado", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @Operation(summary = "Listar resultados por departamento", description = "Obtiene resultados filtrados por departamento")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resultados encontrados",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ResultadoMesaDto.class))))
    })
    @GetMapping("/resultados/departamento/{departamento}")
    public ResponseEntity<List<ResultadoMesaDto>> listarPorDepartamento(
            @Parameter(description = "Nombre del departamento", example = "La Paz", required = true)
            @PathVariable String departamento) {
        return ResponseEntity.ok(service.listarPorDepartamento(departamento));
    }

    @Operation(summary = "Listar resultados por municipio", description = "Obtiene resultados filtrados por municipio")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resultados encontrados",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ResultadoMesaDto.class))))
    })
    @GetMapping("/resultados/municipio/{municipio}")
    public ResponseEntity<List<ResultadoMesaDto>> listarPorMunicipio(
            @Parameter(description = "Nombre del municipio", example = "La Paz", required = true)
            @PathVariable String municipio) {
        return ResponseEntity.ok(service.listarPorMunicipio(municipio));
    }

    @Operation(summary = "Crear nuevo resultado", description = "Registra un nuevo resultado electoral de mesa")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Resultado creado exitosamente",
            content = @Content(schema = @Schema(implementation = ResultadoMesaDto.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o mesa ya registrada")
    })
    @PostMapping("/resultados")
    public ResponseEntity<ResultadoMesaDto> crear(
            @Valid @RequestBody ResultadoMesaCreacionDto dto) {
        ResultadoMesaDto creado = service.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(summary = "Actualizar resultado", description = "Actualiza un resultado electoral existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resultado actualizado exitosamente",
            content = @Content(schema = @Schema(implementation = ResultadoMesaDto.class))),
        @ApiResponse(responseCode = "404", description = "Resultado no encontrado")
    })
    @PutMapping("/resultados/{id}")
    public ResponseEntity<ResultadoMesaDto> actualizar(
            @Parameter(description = "ID del resultado", example = "1", required = true)
            @PathVariable Long id,
            @Valid @RequestBody ResultadoMesaActualizacionDto dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @Operation(summary = "Eliminar resultado", description = "Elimina un resultado electoral")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Resultado eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Resultado no encontrado")
    })
    @DeleteMapping("/resultados/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID del resultado", example = "1", required = true)
            @PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Estadísticas por departamento", description = "Obtiene estadísticas agregadas por departamento")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estadísticas calculadas",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = EstadisticaDto.class))))
    })
    @GetMapping("/resultados/estadisticas")
    public ResponseEntity<List<EstadisticaDto>> obtenerEstadisticas() {
        return ResponseEntity.ok(service.obtenerEstadisticasPorDepartamento());
    }

    @Operation(summary = "Estadística de un departamento", description = "Obtiene estadística de un departamento específico")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estadística calculada",
            content = @Content(schema = @Schema(implementation = EstadisticaDto.class))),
        @ApiResponse(responseCode = "404", description = "Departamento sin resultados")
    })
    @GetMapping("/resultados/estadisticas/{departamento}")
    public ResponseEntity<EstadisticaDto> obtenerEstadisticaDepartamento(
            @Parameter(description = "Nombre del departamento", example = "La Paz", required = true)
            @PathVariable String departamento) {
        return ResponseEntity.ok(service.obtenerEstadisticaDepartamento(departamento));
    }
}
