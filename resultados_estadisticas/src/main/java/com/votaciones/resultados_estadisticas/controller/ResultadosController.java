package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.service.ResultadosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
	@GetMapping
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Lista de resultados",
			content = @Content(mediaType = "application/json",
				array = @ArraySchema(schema = @Schema(implementation = ResultadoMesa.class)),
				examples = @ExampleObject(name = "EjemploResultados",
					value = "[{\n  \"id\": 1, \"departamento\": \"La Paz\", \"municipio\": \"La Paz\", \"recinto\": \"Colegio Bolívar\", \"mesa\": \"Mesa 1\", \"inscritos\": 300, \"votosValidosPresencial\": 200, \"votosNulosPresencial\": 10, \"votosBlancosPresencial\": 5, \"votosValidosWeb\": 0, \"votosNulosWeb\": 0, \"votosBlancosWeb\": 0, \"registradoEn\": \"2025-09-11T13:00:00Z\", \"actualizadoEn\": \"2025-09-11T13:10:00Z\"\n}]")))
	})
	public ResponseEntity<List<ResultadoMesa>> listarResultados() {
		return ResponseEntity.ok(resultadosService.listarResultados());
	}

	@Operation(summary = "Obtener resultado por ID", description = "Obtiene un resultado específico por su ID")
	@GetMapping("/{id}")
	public ResponseEntity<ResultadoMesa> obtenerResultado(
			@Parameter(description = "ID del resultado", example = "1", required = true)
			@PathVariable Long id) {
		return ResponseEntity.ok(resultadosService.obtenerPorId(id));
	}

	@Operation(summary = "Resultados por departamento", description = "Obtiene resultados filtrados por departamento")
	@GetMapping("/departamento/{departamento}")
	public ResponseEntity<List<ResultadoMesa>> resultadosPorDepartamento(
			@Parameter(description = "Nombre del departamento", example = "La Paz", required = true)
			@PathVariable String departamento) {
		return ResponseEntity.ok(resultadosService.listarPorDepartamento(departamento));
	}

	@Operation(summary = "Estadísticas por departamento", description = "Resumen de estadísticas por departamento (agregado total o por canal)")
	@GetMapping("/estadisticas")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Lista de estadísticas por departamento",
			content = @Content(mediaType = "application/json",
				array = @ArraySchema(schema = @Schema(implementation = EstadisticaDto.class)),
				examples = @ExampleObject(name = "EjemploEstadisticas",
					value = "[{\n  \"departamento\": \"La Paz\", \"totalVotantes\": 300, \"votosValidos\": 200, \"votosNulos\": 10, \"votosBlancos\": 5, \"participacionPorcentaje\": 71.67\n}]")))
	})
	public ResponseEntity<List<EstadisticaDto>> estadisticasPorDepartamento(
			@Parameter(description = "Canal opcional: presencial o web")
			@RequestParam(name = "canal", required = false) String canal) {
		if (canal == null || canal.isBlank()) {
			return ResponseEntity.ok(resultadosService.estadisticasPorDepartamento());
		}
		return ResponseEntity.ok(resultadosService.estadisticasPorDepartamento(canal));
	}

	@Operation(summary = "Estadística de un departamento", description = "Resumen de un departamento específico (agregado total o por canal)")
	@GetMapping("/estadisticas/{departamento}")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Estadística del departamento",
			content = @Content(mediaType = "application/json",
				schema = @Schema(implementation = EstadisticaDto.class),
				examples = @ExampleObject(name = "EjemploEstadistica",
					value = "{\n  \"departamento\": \"La Paz\", \"totalVotantes\": 300, \"votosValidos\": 200, \"votosNulos\": 10, \"votosBlancos\": 5, \"participacionPorcentaje\": 71.67\n}")))
	})
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


