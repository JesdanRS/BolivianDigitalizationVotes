package com.votaciones.auditoria_registros.controller;

import com.votaciones.auditoria_registros.dto.AuditoriaCreacionDto;
import com.votaciones.auditoria_registros.dto.AuditoriaDto;
import com.votaciones.auditoria_registros.service.AuditoriaRegistroService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @Operation(summary = "Registrar un nuevo evento de auditoría")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Evento registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida o datos incompletos"),
        @ApiResponse(responseCode = "409", description = "Evento duplicado detectado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<AuditoriaDto> crearRegistro(@Valid @RequestBody AuditoriaCreacionDto dto) {
        AuditoriaDto resultado = auditoriaService.crearRegistro(dto);
        return ResponseEntity.ok(resultado);
    }

    @Operation(summary = "Obtener todos los registros de auditoría")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registros obtenidos exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/eventos")
    public ResponseEntity<List<AuditoriaDto>> obtenerRegistros() {
        return ResponseEntity.ok(auditoriaService.obtenerRegistros());
    }

    @Operation(summary = "Obtener un registro de auditoría por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registro obtenido exitosamente"),
        @ApiResponse(responseCode = "404", description = "Registro no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AuditoriaDto> obtenerPorId(
            @Parameter(description = "ID del registro", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(auditoriaService.obtenerRegistroPorId(id));
    }

    @Operation(summary = "Filtrar registros por usuario")
    @GetMapping("/usuario/{usuario}")
    public ResponseEntity<List<AuditoriaDto>> obtenerPorUsuario(
            @Parameter(description = "Cédula del usuario", example = "12345678") @PathVariable String usuario) {
        return ResponseEntity.ok(auditoriaService.obtenerRegistrosPorUsuario(usuario));
    }

    @Operation(summary = "Filtrar registros por tipo de evento")
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<AuditoriaDto>> obtenerPorTipo(
            @Parameter(description = "Tipo de evento", example = "LOGIN") @PathVariable String tipo) {
        return ResponseEntity.ok(auditoriaService.obtenerRegistrosPorTipo(tipo));
    }

    @Operation(summary = "Filtrar registros por módulo")
    @GetMapping("/modulo/{modulo}")
    public ResponseEntity<List<AuditoriaDto>> obtenerPorModulo(
            @Parameter(description = "Nombre del módulo", example = "Usuarios") @PathVariable String modulo) {
        return ResponseEntity.ok(auditoriaService.obtenerRegistrosPorModulo(modulo));
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

    @Operation(summary = "Obtener cantidad de eventos agrupados por tipo")
    @GetMapping("/contarPorTipo")
    public ResponseEntity<Map<String, Long>> contarPorTipo() {
        return ResponseEntity.ok(auditoriaService.contarEventosPorTipo());
    }

    @Operation(summary = "Obtener cantidad de eventos agrupados por severidad")
    @GetMapping("/contarPorSeveridad")
    public ResponseEntity<Map<String, Long>> contarPorSeveridad() {
        return ResponseEntity.ok(auditoriaService.contarEventosPorSeveridad());
    }

    @Operation(summary = "Obtener cantidad de eventos agrupados por módulo")
    @GetMapping("/contarPorModulo")
    public ResponseEntity<Map<String, Long>> contarPorModulo() {
        return ResponseEntity.ok(auditoriaService.contarEventosPorModulo());
    }

    @Operation(summary = "Obtener resumen general de KPIs (total, por tipo, severidad y módulo)")
    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> obtenerResumen() {
        return ResponseEntity.ok(auditoriaService.obtenerResumenEstadistico());
    }

    @GetMapping("/filtros")
    public ResponseEntity<List<AuditoriaDto>> filtrar(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String severidad,
            @RequestParam(required = false) String modulo,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        return ResponseEntity.ok(auditoriaService.buscarConFiltros(tipo, severidad, modulo, usuario, inicio, fin));
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
