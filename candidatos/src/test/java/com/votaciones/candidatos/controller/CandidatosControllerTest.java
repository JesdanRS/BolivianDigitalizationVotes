package com.votaciones.candidatos.controller;

import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.exception.RecursoNoEncontradoException;
import com.votaciones.candidatos.service.CandidatoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/**
 * Tests unitarios para el controlador REST CRUD de candidatos
 */
@SpringBootTest(
	webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
	properties = {
		"spring.cloud.function.enabled=false",
		"spring.cloud.stream.enabled=false"
	}
)
@ActiveProfiles("test")
public class CandidatosControllerTest {

	@Autowired
	private TestRestTemplate restTemplate;

	@MockBean
	private CandidatoService candidatoService;

	private candidatosDto candidatoDto;
	private candidatosDto candidatoDto2;

	@BeforeEach
	void setUp() {
		// Configurar DTO de respuesta 1
		candidatoDto = new candidatosDto();
		candidatoDto.setId(1L);
		candidatoDto.setPartido("MAS");
		candidatoDto.setNombreCompletoPresidente("Luis Alberto Arce");
		candidatoDto.setNombreCompletoVicepresidente("David Choquehuanca");
		candidatoDto.setCarnetPresidente("12345678");
		candidatoDto.setCarnetVicepresidente("87654321");
		candidatoDto.setFechaNacimientoPresidente(LocalDate.of(1965, 9, 28));
		candidatoDto.setFechaNacimientoVicepresidente(LocalDate.of(1964, 6, 15));
		candidatoDto.setCorreoElectronico("contacto@mas.bo");
		candidatoDto.setCorreoVerificado(false);

		// Configurar DTO de respuesta 2
		candidatoDto2 = new candidatosDto();
		candidatoDto2.setId(2L);
		candidatoDto2.setPartido("CC");
		candidatoDto2.setNombreCompletoPresidente("Luis Fernando Camacho");
		candidatoDto2.setNombreCompletoVicepresidente("Boris Bueno");
		candidatoDto2.setCorreoElectronico("contacto@cc.bo");
	}

	@Test
	void testListarCandidatos() {
		List<candidatosDto> candidatos = Arrays.asList(candidatoDto, candidatoDto2);
		when(candidatoService.listarTodos()).thenReturn(candidatos);

		ResponseEntity<candidatosDto[]> response = restTemplate.getForEntity(
			"/api/candidatos",
			candidatosDto[].class
		);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals(2, response.getBody().length);
	}

	@Test
	void testObtenerCandidatoPorId() {
		when(candidatoService.obtenerPorId(1L)).thenReturn(candidatoDto);

		ResponseEntity<candidatosDto> response = restTemplate.getForEntity(
			"/api/candidatos/1",
			candidatosDto.class
		);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals(1L, response.getBody().getId());
		assertEquals("MAS", response.getBody().getPartido());
	}

	@Test
	void testObtenerCandidatoNoEncontrado() {
		when(candidatoService.obtenerPorId(999L))
			.thenThrow(new RecursoNoEncontradoException("Candidatura no encontrada con ID: 999"));

		ResponseEntity<candidatosDto> response = restTemplate.getForEntity(
			"/api/candidatos/999",
			candidatosDto.class
		);

		assertTrue(response.getStatusCode().is4xxClientError());
	}

	@Test
	void testCrearCandidato() {
		candidatosDto nuevoDto = new candidatosDto();
		nuevoDto.setNombreCompletoPresidente("Nuevo Candidato");
		nuevoDto.setPartido("NUEVO");

		when(candidatoService.crear(any(candidatosDto.class)))
			.thenReturn(candidatoDto);

		ResponseEntity<candidatosDto> response = restTemplate.postForEntity(
			"/api/candidatos",
			nuevoDto,
			candidatosDto.class
		);

		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals(1L, response.getBody().getId());
	}

	@Test
	void testActualizarCandidato() {
		candidatosDto updateDto = new candidatosDto();
		updateDto.setNombreCompletoPresidente("Luis Alberto Arce Catacora");
		updateDto.setCorreoElectronico("nuevo@mas.bo");

		candidatosDto actualizado = new candidatosDto();
		actualizado.setId(1L);
		actualizado.setNombreCompletoPresidente("Luis Alberto Arce Catacora");
		actualizado.setCorreoElectronico("nuevo@mas.bo");

		when(candidatoService.actualizar(eq(1L), any(candidatosDto.class)))
			.thenReturn(actualizado);

		ResponseEntity<candidatosDto> response = restTemplate.exchange(
			"/api/candidatos/1",
			HttpMethod.PUT,
			new HttpEntity<>(updateDto),
			candidatosDto.class
		);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals("Luis Alberto Arce Catacora", response.getBody().getNombreCompletoPresidente());
	}

	@Test
	void testEliminarCandidato() {
		ResponseEntity<Void> response = restTemplate.exchange(
			"/api/candidatos/1",
			HttpMethod.DELETE,
			null,
			Void.class
		);

		assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
	}

	@Test
	void testEliminarCandidatoNoEncontrado() {
		ResponseEntity<Void> response = restTemplate.exchange(
			"/api/candidatos/999",
			HttpMethod.DELETE,
			null,
			Void.class
		);

		assertTrue(response.getStatusCode().is4xxClientError());
	}
}
