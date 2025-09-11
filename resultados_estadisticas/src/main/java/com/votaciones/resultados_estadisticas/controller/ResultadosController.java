package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.service.ResultadosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/resultados")
@Tag(name = "Resultados", description = "API REST para resultados y estadísticas de votaciones")
public class ResultadosController {

	@Autowired
	private ResultadosService resultadosService;

	@Operation(summary = "Listar resultados", description = "Obtiene todos los resultados por mesa")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista de resultados")
	})
	@GetMapping
	public ResponseEntity<List<ResultadoMesa>> listarResultados() {
		return ResponseEntity.ok(resultadosService.listarResultados());
	}

	@Operation(summary = "Resultados por departamento", description = "Obtiene resultados filtrados por departamento")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista de resultados del departamento")
	})
	@GetMapping("/departamento/{departamento}")
	public ResponseEntity<List<ResultadoMesa>> resultadosPorDepartamento(
			@Parameter(description = "Nombre del departamento", example = "La Paz", required = true)
			@PathVariable String departamento) {
		return ResponseEntity.ok(resultadosService.listarPorDepartamento(departamento));
	}

	@Operation(summary = "Estadísticas por departamento", description = "Resumen de estadísticas por departamento")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista de estadísticas por departamento")
	})
	@GetMapping("/estadisticas")
	public ResponseEntity<List<EstadisticaDto>> estadisticasPorDepartamento() {
		return ResponseEntity.ok(resultadosService.estadisticasPorDepartamento());
	}

	@Operation(summary = "Estadística de un departamento", description = "Resumen de un departamento específico")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Estadística del departamento")
	})
	@GetMapping("/estadisticas/{departamento}")
	public ResponseEntity<EstadisticaDto> estadisticaDeDepartamento(
			@Parameter(description = "Nombre del departamento", example = "La Paz", required = true)
			@PathVariable String departamento) {
		return ResponseEntity.ok(resultadosService.estadisticaDe(departamento));
	}
}


