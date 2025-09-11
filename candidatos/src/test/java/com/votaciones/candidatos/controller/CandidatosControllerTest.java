package com.votaciones.candidatos.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.votaciones.candidatos.dto.CandidatoCreacionDto;
import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.exception.RecursoNoEncontradoException;
import com.votaciones.candidatos.service.CandidatoService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class CandidatosControllerTest {

	@LocalServerPort
	private int port;
	@Autowired
	private WebTestClient webTestClient;

	@MockBean
	private CandidatoService candidatoService;

	private ObjectMapper objectMapper;
	private CandidatoCreacionDto creacionDto;
	private candidatosDto respuestaDto;

	@BeforeEach
	void setUp() {
		objectMapper = new ObjectMapper();

		creacionDto = new CandidatoCreacionDto();
		creacionDto.setPartido("MAS");
		creacionDto.setNombreCompletoPresidente("Presidente Test");
		creacionDto.setNombreCompletoVicepresidente("Vice Test");
		creacionDto.setDescripcion("Desc");

		respuestaDto = new candidatosDto();
		respuestaDto.setIdCandidato(1L);
		respuestaDto.setPartido("MAS");
		respuestaDto.setNombreCompletoPresidente("Presidente Test");
		respuestaDto.setNombreCompletoVicepresidente("Vice Test");
	}

	@Test
	void testCrearCandidatoExitoso() throws Exception {
		when(candidatoService.crearCandidato(any(CandidatoCreacionDto.class))).thenReturn(respuestaDto);

		webTestClient.post().uri("/candidatos")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(objectMapper.writeValueAsString(creacionDto))
			.exchange()
			.expectStatus().isCreated()
			.expectBody()
			.jsonPath("$.idCandidato").isEqualTo(1)
			.jsonPath("$.partido").isEqualTo("MAS");
	}

	@Test
	void testObtenerPorIdExitoso() throws Exception {
		when(candidatoService.obtenerPorId(1L)).thenReturn(respuestaDto);

		webTestClient.get().uri("/candidatos/1")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$.idCandidato").isEqualTo(1);
	}

	@Test
	void testObtenerPorIdNoEncontrado() throws Exception {
		when(candidatoService.obtenerPorId(999L)).thenThrow(new RecursoNoEncontradoException("Candidato", 999L));

		webTestClient.get().uri("/candidatos/999")
			.exchange()
			.expectStatus().isNotFound()
			.expectBody()
			.jsonPath("$.status").isEqualTo(404)
			.jsonPath("$.error").isEqualTo("Recurso no encontrado");
	}

	@Test
	void testListar() throws Exception {
		List<candidatosDto> lista = Arrays.asList(respuestaDto);
		when(candidatoService.listar()).thenReturn(lista);

		webTestClient.get().uri("/candidatos")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].idCandidato").isEqualTo(1);
	}
}


