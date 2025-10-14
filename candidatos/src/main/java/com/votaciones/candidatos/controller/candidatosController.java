package com.votaciones.candidatos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.votaciones.candidatos.dto.CandidatoCreacionDto;
import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.service.CandidatoService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador REST para la gestión de candidatos en el sistema de votaciones bolivianas
 */
@RestController
@RequestMapping("/candidatos")
@Tag(name = "Candidato", description = "API REST para la gestión de candidatos del sistema de votaciones bolivianas")
public class candidatosController {

	@Autowired
	private CandidatoService candidatoService;

	@Operation(summary = "Crear candidato", description = "Crea un nuevo candidato en el sistema de votaciones")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "201", description = "Candidato creado exitosamente"),
		@ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
	})
	@PostMapping
	public ResponseEntity<candidatosDto> crearCandidato(@Valid @RequestBody CandidatoCreacionDto dto) {
		candidatosDto creado = candidatoService.crearCandidato(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(creado);
	}

	@Operation(summary = "Obtener candidato por ID", description = "Obtiene un candidato específico por su ID")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Candidato encontrado"),
		@ApiResponse(responseCode = "404", description = "Candidato no encontrado")
	})
	@GetMapping("/{id}")
	public ResponseEntity<candidatosDto> obtenerCandidato(
			@Parameter(description = "ID del candidato", example = "1", required = true) 
			@PathVariable Long id) {
		candidatosDto encontrado = candidatoService.obtenerPorId(id);
		return ResponseEntity.ok(encontrado);
	}

	@Operation(summary = "Listar candidatos", description = "Obtiene la lista de candidatos, opcionalmente filtrada por partido")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista de candidatos obtenida exitosamente")
	})
	@GetMapping
	public ResponseEntity<List<candidatosDto>> listar(
			@Parameter(description = "Filtrar por partido político", example = "MAS", required = false)
			@RequestParam(value = "partido", required = false) String partido) {
		if (partido != null && !partido.isBlank()) {
			return ResponseEntity.ok(candidatoService.buscarPorPartido(partido));
		}
		return ResponseEntity.ok(candidatoService.listar());
	}
}