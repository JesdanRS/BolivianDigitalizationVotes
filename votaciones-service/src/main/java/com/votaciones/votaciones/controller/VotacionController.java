package com.votaciones.votaciones.controller;

import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.service.VotacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/votaciones")
@Tag(name = "Votaciones", description = "API REST para la gestión de votaciones")
public class VotacionController {

	private final VotacionService votacionService;

	@Autowired
	public VotacionController(VotacionService votacionService) {
		this.votacionService = votacionService;
	}

	@Operation(summary = "Crear votación", description = "Crea un nuevo registro de votación")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "201", description = "Votación creada exitosamente"),
		@ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
	})
	@PostMapping
	public ResponseEntity<VotacionDto> crear(@Valid @RequestBody VotacionCreacionDto dto) {
		VotacionDto creado = votacionService.crear(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(creado);
	}

	@Operation(summary = "Obtener votación por ID", description = "Obtiene una votación específica por su ID")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Votación encontrada"),
		@ApiResponse(responseCode = "404", description = "Votación no encontrada")
	})
	@GetMapping("/{id}")
	public ResponseEntity<VotacionDto> obtener(
		@Parameter(description = "ID de la votación", example = "1", required = true)
		@PathVariable Long id) {
		return ResponseEntity.ok(votacionService.obtenerPorId(id));
	}

	@Operation(summary = "Listar votaciones", description = "Obtiene la lista completa de votaciones")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
	})
	@GetMapping
	public ResponseEntity<List<VotacionDto>> listar() {
		return ResponseEntity.ok(votacionService.listar());
	}

	@Operation(summary = "Buscar por localidad", description = "Obtiene votaciones filtradas por localidad")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
	})
	@GetMapping("/localidad/{localidad}")
	public ResponseEntity<List<VotacionDto>> buscarPorLocalidad(
		@Parameter(description = "Nombre de la localidad", example = "La Paz", required = true)
		@PathVariable String localidad) {
		return ResponseEntity.ok(votacionService.buscarPorLocalidad(localidad));
	}
}


