package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.service.ResultadosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resultados")
@RequiredArgsConstructor
@Tag(name = "Resultados", description = "API REST para resultados y estadísticas de votaciones - CRUD completo con PostgreSQL")
public class ResultadosController {

	private final ResultadosService resultadosService;

	// ========================================
	// CRUD COMPLETO - DATOS REALES DESDE BD
	// ========================================

	@Operation(summary = "Crear resultado", description = "Crea un nuevo resultado de mesa (datos se guardan en PostgreSQL)")
	@ApiResponses({
		@ApiResponse(responseCode = "201", description = "Resultado creado exitosamente"),
		@ApiResponse(responseCode = "400", description = "Datos inválidos"),
		@ApiResponse(responseCode = "403", description = "Acceso denegado - Requiere rol ADMIN")
	})
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<ResultadoMesa> crear(@Valid @RequestBody ResultadoMesa resultado) {
		ResultadoMesa creado = resultadosService.crear(resultado);
		return ResponseEntity.status(HttpStatus.CREATED).body(creado);
	}

	@Operation(summary = "Listar todos los resultados", description = "Obtiene todos los resultados desde PostgreSQL")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Lista de resultados obtenida exitosamente"),
		@ApiResponse(responseCode = "403", description = "Acceso denegado - Requiere autenticación")
	})
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping
	public ResponseEntity<List<ResultadoMesa>> listar() {
		return ResponseEntity.ok(resultadosService.listarResultados());
	}

	@Operation(summary = "Obtener resultado por ID", description = "Obtiene un resultado específico desde PostgreSQL")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Resultado encontrado"),
		@ApiResponse(responseCode = "404", description = "Resultado no encontrado"),
		@ApiResponse(responseCode = "403", description = "Acceso denegado - Requiere autenticación")
	})
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<ResultadoMesa> obtenerPorId(
			@Parameter(description = "ID del resultado", example = "1", required = true)
			@PathVariable Long id) {
		return ResponseEntity.ok(resultadosService.obtenerPorId(id));
	}

	@Operation(summary = "Actualizar resultado", description = "Actualiza un resultado existente en PostgreSQL")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Resultado actualizado exitosamente"),
		@ApiResponse(responseCode = "404", description = "Resultado no encontrado"),
		@ApiResponse(responseCode = "403", description = "Acceso denegado - Requiere rol ADMIN")
	})
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<ResultadoMesa> actualizar(
			@PathVariable Long id, 
			@Valid @RequestBody ResultadoMesa resultado) {
		return ResponseEntity.ok(resultadosService.actualizar(id, resultado));
	}

	@Operation(summary = "Eliminar resultado", description = "Elimina un resultado de PostgreSQL")
	@ApiResponses({
		@ApiResponse(responseCode = "204", description = "Resultado eliminado exitosamente"),
		@ApiResponse(responseCode = "404", description = "Resultado no encontrado"),
		@ApiResponse(responseCode = "403", description = "Acceso denegado - Requiere rol ADMIN")
	})
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		resultadosService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

	// ========================================
	// CONSULTAS CON REPOSITORY
	// ========================================

	@Operation(summary = "Buscar por departamento (DERIVED QUERY)", 
		description = "Usa consulta derivada: findByDepartamentoIgnoreCase")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/departamento/{departamento}")
	public ResponseEntity<List<ResultadoMesa>> buscarPorDepartamento(
			@Parameter(description = "Nombre del departamento", example = "La Paz")
			@PathVariable String departamento) {
		return ResponseEntity.ok(resultadosService.listarPorDepartamento(departamento));
	}

	@Operation(summary = "Buscar por mínimo de inscritos (JPQL QUERY)", 
		description = "Usa consulta JPQL con filtro y ordenamiento")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/inscritos-minimo/{min}")
	public ResponseEntity<List<ResultadoMesa>> buscarPorMinimoInscritos(
			@Parameter(description = "Mínimo de inscritos", example = "300")
			@PathVariable Long min) {
		return ResponseEntity.ok(resultadosService.buscarPorMinimoInscritos(min));
	}

	@Operation(summary = "Buscar por votos válidos mínimos (NATIVE QUERY)", 
		description = "Usa consulta SQL nativa")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/votos-validos-minimo/{min}")
	public ResponseEntity<List<ResultadoMesa>> buscarPorVotosValidosMinimos(
			@Parameter(description = "Mínimo de votos válidos totales", example = "200")
			@PathVariable Long min) {
		return ResponseEntity.ok(resultadosService.buscarPorVotosValidosMinimos(min));
	}

	@Operation(summary = "Sumar inscritos por departamento (JPQL)", 
		description = "Agrega inscritos por departamento con consulta JPQL")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/reportes/inscritos-por-departamento")
	public ResponseEntity<List<Map<String, Object>>> inscritosPorDepartamento() {
		List<Object[]> rows = resultadosService.sumarInscritosPorDepartamento();
		List<Map<String, Object>> result = rows.stream()
			.map(r -> Map.of("departamento", r[0], "totalInscritos", r[1]))
			.collect(Collectors.toList());
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "Contar mesas por departamento (NATIVE)", 
		description = "Cuenta mesas con consulta SQL nativa")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/reportes/mesas-por-departamento")
	public ResponseEntity<List<Map<String, Object>>> mesasPorDepartamento() {
		List<Object[]> rows = resultadosService.contarMesasPorDepartamento();
		List<Map<String, Object>> result = rows.stream()
			.map(r -> Map.of("departamento", r[0], "totalMesas", r[1]))
			.collect(Collectors.toList());
		return ResponseEntity.ok(result);
	}

	// ========================================
	// ESTADÍSTICAS
	// ========================================

	@Operation(summary = "Estadísticas por departamento")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/estadisticas")
	public ResponseEntity<List<EstadisticaDto>> estadisticasPorDepartamento() {
		return ResponseEntity.ok(resultadosService.estadisticasPorDepartamento());
	}

	@Operation(summary = "Estadística de un departamento específico")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping("/estadisticas/{departamento}")
	public ResponseEntity<EstadisticaDto> estadisticaDeDepartamento(
			@PathVariable String departamento) {
		return ResponseEntity.ok(resultadosService.estadisticaDe(departamento));
	}
}
