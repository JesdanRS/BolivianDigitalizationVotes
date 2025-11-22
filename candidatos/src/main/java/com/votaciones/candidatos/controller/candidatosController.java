package com.votaciones.candidatos.controller;

import com.votaciones.dto.candidatos.CandidatoDto;
import com.votaciones.candidatos.service.CandidatoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

/**
 * Controlador REST para la gestión CRUD de candidatos
 * TODOS los endpoints requieren autenticación OAuth2 con token JWT especificado en el header Authorization
 */
@RestController
@RequestMapping("/api/candidatos")
@Tag(name = "Candidato", description = "API REST para CRUD de candidatos (OAuth2 protegido)")
@PreAuthorize("isAuthenticated()")
public class candidatosController {

	private final CandidatoService candidatoService;

	@Autowired
	public candidatosController(CandidatoService candidatoService) {
		this.candidatoService = candidatoService;
	}

	/**
	 * Obtener todos los candidatos - REQUIERE AUTENTICACIÓN
	 */
	@Operation(summary = "Listar candidatos", description = "Obtiene la lista de todos los candidatos (requiere token)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente"),
		@ApiResponse(responseCode = "401", description = "No autenticado - Token requerido")
	})
	@GetMapping
	public ResponseEntity<List<CandidatoDto>> listarCandidatos() {
		List<CandidatoDto> candidatos = candidatoService.listarTodos();
		return ResponseEntity.ok(candidatos);
	}

	/**
	 * Obtener un candidato por ID - REQUIERE AUTENTICACIÓN
	 */
	@Operation(summary = "Obtener candidato", description = "Obtiene un candidato específico por su ID (requiere token)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Candidato encontrado"),
		@ApiResponse(responseCode = "401", description = "No autenticado - Token requerido"),
		@ApiResponse(responseCode = "404", description = "Candidato no encontrado")
	})
	@GetMapping("/{id}")
	public ResponseEntity<CandidatoDto> obtenerCandidato(@PathVariable Long id) {
		CandidatoDto candidato = candidatoService.obtenerPorId(id);
		return ResponseEntity.ok(candidato);
	}

	/**
	 * Crear un nuevo candidato - REQUIERE AUTENTICACIÓN
	 */
	@Operation(summary = "Crear candidato", description = "Crea un nuevo candidato en el sistema (requiere token)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "201", description = "Candidato creado exitosamente"),
		@ApiResponse(responseCode = "401", description = "No autenticado - Token requerido"),
		@ApiResponse(responseCode = "400", description = "Datos inválidos")
	})
	@PostMapping
	public ResponseEntity<CandidatoDto> crearCandidato(@Valid @RequestBody CandidatoDto candidatoDto) {
		CandidatoDto nuevoCandidat = candidatoService.crear(candidatoDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCandidat);
	}

	/**
	 * Actualizar un candidato - REQUIERE AUTENTICACIÓN
	 */
	@Operation(summary = "Actualizar candidato", description = "Actualiza los datos de un candidato existente (requiere token)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Candidato actualizado exitosamente"),
		@ApiResponse(responseCode = "401", description = "No autenticado - Token requerido"),
		@ApiResponse(responseCode = "404", description = "Candidato no encontrado"),
		@ApiResponse(responseCode = "400", description = "Datos inválidos")
	})
	@PutMapping("/{id}")
	public ResponseEntity<CandidatoDto> actualizarCandidato(
			@PathVariable Long id,
			@Valid @RequestBody CandidatoDto candidatoDto) {
		CandidatoDto candidatoActualizado = candidatoService.actualizar(id, candidatoDto);
		return ResponseEntity.ok(candidatoActualizado);
	}

	/**
	 * Eliminar un candidato - REQUIERE AUTENTICACIÓN
	 */
	@Operation(summary = "Eliminar candidato", description = "Elimina un candidato del sistema (requiere token)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "Candidato eliminado exitosamente"),
		@ApiResponse(responseCode = "401", description = "No autenticado - Token requerido"),
		@ApiResponse(responseCode = "404", description = "Candidato no encontrado")
	})
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarCandidato(@PathVariable Long id) {
		candidatoService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}
