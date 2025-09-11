package com.votaciones.votaciones.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.exception.RecursoNoEncontradoException;
import com.votaciones.votaciones.service.VotacionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class VotacionControllerTest {

	@LocalServerPort
	private int port;
	@Autowired
	private WebTestClient webTestClient;

	@MockBean
	private VotacionService votacionService;

	private ObjectMapper objectMapper;
	private VotacionCreacionDto creacionDto;
	private VotacionDto respuestaDto;

	@BeforeEach
	void setUp() {
		objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

		creacionDto = new VotacionCreacionDto();
		creacionDto.setPartido("Movimiento al Socialismo");
		creacionDto.setCandidato("Juan Pérez");
		creacionDto.setLocalidad("La Paz");
		creacionDto.setFecha(Instant.parse("2025-09-10T10:30:00Z"));

		respuestaDto = new VotacionDto();
		respuestaDto.setId(1L);
		respuestaDto.setPartido("Movimiento al Socialismo");
		respuestaDto.setCandidato("Juan Pérez");
		respuestaDto.setLocalidad("La Paz");
		respuestaDto.setFecha(Instant.parse("2025-09-10T10:30:00Z"));
	}

	@Test
	void testCrearVotacionExitoso() throws Exception {
		when(votacionService.crear(any(VotacionCreacionDto.class))).thenReturn(respuestaDto);

		webTestClient.post().uri("/votaciones")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(objectMapper.writeValueAsString(creacionDto))
			.exchange()
			.expectStatus().isCreated()
			.expectBody()
			.jsonPath("$.id").isEqualTo(1)
			.jsonPath("$.partido").isEqualTo("Movimiento al Socialismo")
			.jsonPath("$.candidato").isEqualTo("Juan Pérez")
			.jsonPath("$.localidad").isEqualTo("La Paz")
			.jsonPath("$.fecha").isEqualTo("2025-09-10T10:30:00Z");
	}

	@Test
	void testCrearVotacionConDatosInvalidos() throws Exception {
		VotacionCreacionDto dtoInvalido = new VotacionCreacionDto();
		dtoInvalido.setPartido("");
		dtoInvalido.setCandidato("");

		webTestClient.post().uri("/votaciones")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(objectMapper.writeValueAsString(dtoInvalido))
			.exchange()
			.expectStatus().isBadRequest();
	}

	@Test
	void testObtenerVotacionPorIdExitoso() throws Exception {
		when(votacionService.obtenerPorId(1L)).thenReturn(respuestaDto);

		webTestClient.get().uri("/votaciones/1")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$.id").isEqualTo(1)
			.jsonPath("$.partido").isEqualTo("Movimiento al Socialismo")
			.jsonPath("$.localidad").isEqualTo("La Paz");
	}

	@Test
	void testObtenerVotacionPorIdNoEncontrado() throws Exception {
		when(votacionService.obtenerPorId(999L))
			.thenThrow(new RecursoNoEncontradoException("Votación", 999L));

		webTestClient.get().uri("/votaciones/999")
			.exchange()
			.expectStatus().isNotFound()
			.expectBody()
			.jsonPath("$.status").isEqualTo(404)
			.jsonPath("$.error").isEqualTo("Recurso no encontrado");
	}

	@Test
	void testListarVotaciones() throws Exception {
		List<VotacionDto> lista = Arrays.asList(respuestaDto);
		when(votacionService.listar()).thenReturn(lista);

		webTestClient.get().uri("/votaciones")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].id").isEqualTo(1)
			.jsonPath("$[0].partido").isEqualTo("Movimiento al Socialismo");
	}

	@Test
	void testBuscarPorLocalidad() throws Exception {
		List<VotacionDto> lista = Arrays.asList(respuestaDto);
		when(votacionService.buscarPorLocalidad("La Paz")).thenReturn(lista);

		webTestClient.get().uri("/votaciones/localidad/La Paz")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].localidad").isEqualTo("La Paz");
	}
}


