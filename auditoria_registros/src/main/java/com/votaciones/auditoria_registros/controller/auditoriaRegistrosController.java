package com.votaciones.auditoria_registros.controller;

import com.votaciones.auditoria_registros.dto.AuditoriaRegistrosDto;
import com.votaciones.auditoria.lib.model.AuditoriaRegistro;
import com.votaciones.auditoria_registros.service.AuditoriaRegistroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auditoria")
@Tag(name = "Auditoría", description = "Microservicio de auditoría y registros")
public class AuditoriaRegistrosController {

    @Autowired
    private final AuditoriaRegistroService auditoriaService;

    public AuditoriaRegistrosController(AuditoriaRegistroService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @Operation(summary = "Crear un nuevo registro de auditoría")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registro creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<AuditoriaRegistro> crearRegistro(@Valid @RequestBody AuditoriaRegistrosDto dto) {
        return ResponseEntity.ok(auditoriaService.crearRegistro(dto));
    }

    @Operation(summary = "Obtener todos los registros de auditoría")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registros obtenidos exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/eventos")
    public ResponseEntity<List<AuditoriaRegistro>> obtenerRegistros() {
        return ResponseEntity.ok(auditoriaService.obtenerRegistros());
    }

    @Operation(summary = "Obtener un registro de auditoría por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registro obtenido exitosamente"),
        @ApiResponse(responseCode = "404", description = "Registro no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AuditoriaRegistro> obtenerPorId(
        @Parameter(description = "ID del registro de auditoría", required = true)
        @PathVariable Long id) {
        return ResponseEntity.ok(auditoriaService.obtenerRegistroPorId(id));
    }

    @Operation(summary = "Eliminar un registro de auditoría por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registro eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Registro no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarRegistro(
        @Parameter(description = "ID del registro de auditoría", required = true)
        @PathVariable Long id) {
        auditoriaService.eliminarRegistro(id);
        return ResponseEntity.ok("Registro eliminado correctamente");
    }

    @Operation(summary = "Obtener estadísticas de registros por tipo de evento")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/contarPorTipo")
    public ResponseEntity<Map<String, Long>> estadisticas() {
        return ResponseEntity.ok(auditoriaService.obtenerEstadisticasPorTipo());
    }

    @Operation(summary = "Exportar registros de auditoría a CSV")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registros exportados exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/formatoCsv")
    public ResponseEntity<List<String>> exportar() {
        return ResponseEntity.ok(auditoriaService.exportarRegistrosCSV());
    }
}
