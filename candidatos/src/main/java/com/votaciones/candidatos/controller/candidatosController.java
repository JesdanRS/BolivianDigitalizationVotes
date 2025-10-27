package com.votaciones.candidatos.controller;

import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.service.CandidatoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

/**
 * Controlador REST para la gestión CRUD de candidatos
 * Solo maneja: Crear, Leer, Actualizar, Eliminar
 */
@RestController
@RequestMapping("/api/candidatos")
@Tag(name = "Candidato", description = "API REST para CRUD de candidatos")
public class candidatosController {

	private final CandidatoService candidatoService;

	@Autowired
	public candidatosController(CandidatoService candidatoService) {
		this.candidatoService = candidatoService;
	}

	/**
	 * Obtener todos los candidatos
	 */
	@Operation(summary = "Listar candidatos", description = "Obtiene la lista de todos los candidatos")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
	})
	@GetMapping
	public ResponseEntity<List<candidatosDto>> listarCandidatos() {
		List<candidatosDto> candidatos = candidatoService.listarTodos();
		return ResponseEntity.ok(candidatos);
	}

	/**
	 * Obtener un candidato por ID
	 */
	@Operation(summary = "Obtener candidato", description = "Obtiene un candidato específico por su ID")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Candidato encontrado"),
		@ApiResponse(responseCode = "404", description = "Candidato no encontrado")
	})
	@GetMapping("/{id}")
	public ResponseEntity<candidatosDto> obtenerCandidato(@PathVariable Long id) {
		candidatosDto candidato = candidatoService.obtenerPorId(id);
		return ResponseEntity.ok(candidato);
	}

	/**
	 * Crear un nuevo candidato
	 */
	@Operation(summary = "Crear candidato", description = "Crea un nuevo candidato en el sistema")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "201", description = "Candidato creado exitosamente"),
		@ApiResponse(responseCode = "400", description = "Datos inválidos")
	})
	@PostMapping
	public ResponseEntity<candidatosDto> crearCandidato(@Valid @RequestBody candidatosDto candidatoDto) {
		candidatosDto nuevoCandidat = candidatoService.crear(candidatoDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCandidat);
	}

	/**
	 * Actualizar un candidato
	 */
	@Operation(summary = "Actualizar candidato", description = "Actualiza los datos de un candidato existente")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Candidato actualizado exitosamente"),
		@ApiResponse(responseCode = "404", description = "Candidato no encontrado"),
		@ApiResponse(responseCode = "400", description = "Datos inválidos")
	})
	@PutMapping("/{id}")
	public ResponseEntity<candidatosDto> actualizarCandidato(
			@PathVariable Long id,
			@Valid @RequestBody candidatosDto candidatoDto) {
		candidatosDto candidatoActualizado = candidatoService.actualizar(id, candidatoDto);
		return ResponseEntity.ok(candidatoActualizado);
	}

	/**
	 * Eliminar un candidato
	 */
	@Operation(summary = "Eliminar candidato", description = "Elimina un candidato del sistema")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "Candidato eliminado exitosamente"),
		@ApiResponse(responseCode = "404", description = "Candidato no encontrado")
	})
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarCandidato(@PathVariable Long id) {
		candidatoService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}
