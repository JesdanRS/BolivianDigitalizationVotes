package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaCreacionDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaActualizacionDto;
import com.votaciones.resultados_estadisticas.service.ResultadoMesaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultados")
public class ResultadoMesaController {

    private final ResultadoMesaService service;

    @Autowired
    public ResultadoMesaController(ResultadoMesaService service) {
        this.service = service;
    }

    /**
     * Endpoint para listar todos los resultados electorales.
     * HTTP Method: GET
     * URL: /api/resultados/resultados
     */
    @GetMapping("/resultados")
    public ResponseEntity<List<ResultadoMesaDto>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    /**
     * Endpoint para obtener un resultado por su ID.
     * HTTP Method: GET
     * URL: /api/resultados/resultados/{id}
     */
    @GetMapping("/resultados/{id}")
    public ResponseEntity<ResultadoMesaDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    /**
     * Endpoint para listar resultados por departamento.
     * HTTP Method: GET
     * URL: /api/resultados/resultados/departamento/{departamento}
     */
    @GetMapping("/resultados/departamento/{departamento}")
    public ResponseEntity<List<ResultadoMesaDto>> listarPorDepartamento(@PathVariable String departamento) {
        return ResponseEntity.ok(service.listarPorDepartamento(departamento));
    }

    /**
     * Endpoint para listar resultados por municipio.
     * HTTP Method: GET
     * URL: /api/resultados/resultados/municipio/{municipio}
     */
    @GetMapping("/resultados/municipio/{municipio}")
    public ResponseEntity<List<ResultadoMesaDto>> listarPorMunicipio(@PathVariable String municipio) {
        return ResponseEntity.ok(service.listarPorMunicipio(municipio));
    }

    /**
     * Endpoint para crear un nuevo resultado electoral.
     * HTTP Method: POST
     * URL: /api/resultados/resultados
     */
    @PostMapping("/resultados")
    public ResponseEntity<ResultadoMesaDto> crear(@Valid @RequestBody ResultadoMesaCreacionDto dto) {
        ResultadoMesaDto creado = service.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /**
     * Endpoint para actualizar un resultado existente.
     * HTTP Method: PUT
     * URL: /api/resultados/resultados/{id}
     */
    @PutMapping("/resultados/{id}")
    public ResponseEntity<ResultadoMesaDto> actualizar(@PathVariable Long id, @Valid @RequestBody ResultadoMesaActualizacionDto dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    /**
     * Endpoint para eliminar un resultado.
     * HTTP Method: DELETE
     * URL: /api/resultados/resultados/{id}
     */
    @DeleteMapping("/resultados/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para obtener estadísticas por departamento.
     * HTTP Method: GET
     * URL: /api/resultados/resultados/estadisticas
     */
    @GetMapping("/resultados/estadisticas")
    public ResponseEntity<List<EstadisticaDto>> obtenerEstadisticas() {
        return ResponseEntity.ok(service.obtenerEstadisticasPorDepartamento());
    }

    /**
     * Endpoint para obtener estadística de un departamento específico.
     * HTTP Method: GET
     * URL: /api/resultados/resultados/estadisticas/{departamento}
     */
    @GetMapping("/resultados/estadisticas/{departamento}")
    public ResponseEntity<EstadisticaDto> obtenerEstadisticaDepartamento(@PathVariable String departamento) {
        return ResponseEntity.ok(service.obtenerEstadisticaDepartamento(departamento));
    }
}
