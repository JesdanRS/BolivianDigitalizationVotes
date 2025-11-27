package com.votaciones.candidatos.controller;

import com.votaciones.dto.candidatos.CandidatoDto;
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

	private CandidatoDto candidatoDto;
	private CandidatoDto candidatoDto2;

	@BeforeEach
	void setUp() {
		// Configurar DTO de respuesta 1
		candidatoDto = new CandidatoDto();
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
		candidatoDto2 = new CandidatoDto();
		candidatoDto2.setId(2L);
		candidatoDto2.setPartido("CC");
		candidatoDto2.setNombreCompletoPresidente("Luis Fernando Camacho");
		candidatoDto2.setNombreCompletoVicepresidente("Boris Bueno");
		candidatoDto2.setCorreoElectronico("contacto@cc.bo");
	}

	@Test
	void testListarCandidatos() {
		List<CandidatoDto> candidatos = Arrays.asList(candidatoDto, candidatoDto2);
		when(candidatoService.listarTodos()).thenReturn(candidatos);

		ResponseEntity<CandidatoDto[]> response = restTemplate.getForEntity(
			"/api/candidatos",
			CandidatoDto[].class
		);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals(2, response.getBody().length);
	}

	@Test
	void testObtenerCandidatoPorId() {
		when(candidatoService.obtenerPorId(1L)).thenReturn(candidatoDto);

		ResponseEntity<CandidatoDto> response = restTemplate.getForEntity(
			"/api/candidatos/1",
			CandidatoDto.class
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

		ResponseEntity<CandidatoDto> response = restTemplate.getForEntity(
			"/api/candidatos/999",
			CandidatoDto.class
		);

		assertTrue(response.getStatusCode().is4xxClientError());
	}

	@Test
	void testCrearCandidato() {
		CandidatoDto nuevoDto = new CandidatoDto();
		nuevoDto.setNombreCompletoPresidente("Nuevo Candidato");
		nuevoDto.setPartido("NUEVO");

		when(candidatoService.crear(any(CandidatoDto.class)))
			.thenReturn(candidatoDto);

		ResponseEntity<CandidatoDto> response = restTemplate.postForEntity(
			"/api/candidatos",
			nuevoDto,
			CandidatoDto.class
		);

		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals(1L, response.getBody().getId());
	}

	@Test
	void testActualizarCandidato() {
		CandidatoDto updateDto = new CandidatoDto();
		updateDto.setNombreCompletoPresidente("Luis Alberto Arce Catacora");
		updateDto.setCorreoElectronico("nuevo@mas.bo");

		CandidatoDto actualizado = new CandidatoDto();
		actualizado.setId(1L);
		actualizado.setNombreCompletoPresidente("Luis Alberto Arce Catacora");
		actualizado.setCorreoElectronico("nuevo@mas.bo");

		when(candidatoService.actualizar(eq(1L), any(CandidatoDto.class)))
			.thenReturn(actualizado);

		ResponseEntity<CandidatoDto> response = restTemplate.exchange(
			"/api/candidatos/1",
			HttpMethod.PUT,
			new HttpEntity<>(updateDto),
			CandidatoDto.class
		);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals("Luis Alberto Arce Catacora", response.getBody().getNombreCompletoPresidente());
	}
}
