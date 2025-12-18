package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.ResultadoPartidoDto;
import com.votaciones.resultados_estadisticas.service.ResultadoPartidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultados")
@Tag(name = "Resultados por Partido", description = "Endpoints para consultar resultados agregados por partido político")
public class ResultadoPartidoController {

    private final ResultadoPartidoService service;

    @Autowired
    public ResultadoPartidoController(ResultadoPartidoService service) {
        this.service = service;
    }

    /**
     * Endpoint para obtener resultados de todos los partidos.
     * Accesible para todos los usuarios autenticados.
     */
    @Operation(summary = "Obtener resultados de todos los partidos", description = "Retorna lista de partidos con conteo de votos y porcentajes, ordenados por votos descendente")
    @GetMapping("/partidos")
    public ResponseEntity<List<ResultadoPartidoDto>> obtenerResultados() {
        return ResponseEntity.ok(service.obtenerResultados());
    }

    /**
     * Endpoint para obtener resultado de un partido específico.
     * Accesible para todos los usuarios autenticados.
     */
    @Operation(summary = "Obtener resultado de un partido específico", description = "Retorna el conteo de votos y porcentaje de un partido político")
    @GetMapping("/partidos/{partido}")
    public ResponseEntity<ResultadoPartidoDto> obtenerResultadoPorPartido(@PathVariable String partido) {
        return ResponseEntity.ok(service.obtenerResultadoPorPartido(partido));
    }
}
