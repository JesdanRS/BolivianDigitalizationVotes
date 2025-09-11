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
import org.springframework.web.bind.annotation.RequestParam;
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

	@Operation(summary = "Obtener resultado por ID", description = "Obtiene un resultado específico por su ID")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Resultado encontrado"),
		@ApiResponse(responseCode = "404", description = "Resultado no encontrado")
	})
	@GetMapping("/{id}")
	public ResponseEntity<ResultadoMesa> obtenerResultado(
			@Parameter(description = "ID del resultado", example = "1", required = true)
			@PathVariable Long id) {
		return ResponseEntity.ok(resultadosService.obtenerPorId(id));
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

	@Operation(summary = "Estadísticas por departamento", description = "Resumen de estadísticas por departamento (agregado total o por canal)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista de estadísticas por departamento")
	})
	@GetMapping("/estadisticas")
	public ResponseEntity<List<EstadisticaDto>> estadisticasPorDepartamento(
			@Parameter(description = "Canal opcional: presencial o web")
			@RequestParam(name = "canal", required = false) String canal) {
		if (canal == null || canal.isBlank()) {
			return ResponseEntity.ok(resultadosService.estadisticasPorDepartamento());
		}
		return ResponseEntity.ok(resultadosService.estadisticasPorDepartamento(canal));
	}

	@Operation(summary = "Estadística de un departamento", description = "Resumen de un departamento específico (agregado total o por canal)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Estadística del departamento")
	})
	@GetMapping("/estadisticas/{departamento}")
	public ResponseEntity<EstadisticaDto> estadisticaDeDepartamento(
			@Parameter(description = "Nombre del departamento", example = "La Paz", required = true)
			@PathVariable String departamento,
			@Parameter(description = "Canal opcional: presencial o web")
			@RequestParam(name = "canal", required = false) String canal) {
		if (canal == null || canal.isBlank()) {
			return ResponseEntity.ok(resultadosService.estadisticaDe(departamento));
		}
		return ResponseEntity.ok(resultadosService.estadisticaDe(departamento, canal));
	}

	// Nota: Si necesitas filtros por canal, podemos añadir request params como ?canal=presencial|web
}


