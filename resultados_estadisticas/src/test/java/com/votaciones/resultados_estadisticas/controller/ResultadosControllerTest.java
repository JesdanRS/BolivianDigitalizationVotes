package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.service.ResultadosService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ResultadosControllerTest {

	@LocalServerPort
	private int port;
	@Autowired
	private WebTestClient webTestClient;

	@MockBean
	private ResultadosService resultadosService;

	private ResultadoMesa muestra;
	private EstadisticaDto estadistica;

	@BeforeEach
	void setUp() {
		muestra = new ResultadoMesa("La Paz", "La Paz", "Recinto", "Mesa 1", 300, 200, 10, 5);
		muestra.setId(1L);
		estadistica = new EstadisticaDto("La Paz", 300, 200, 10, 5, 71.67);
	}

	@Test
	void testListarResultados() {
		when(resultadosService.listarResultados()).thenReturn(Arrays.asList(muestra));

		webTestClient.get().uri("/resultados")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].departamento").isEqualTo("La Paz");
	}

	@Test
	void testResultadosPorDepartamento() {
		when(resultadosService.listarPorDepartamento("La Paz")).thenReturn(Arrays.asList(muestra));

		webTestClient.get().uri("/resultados/departamento/La Paz")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].departamento").isEqualTo("La Paz");
	}

	@Test
	void testEstadisticasPorDepartamento() {
		when(resultadosService.estadisticasPorDepartamento()).thenReturn(Arrays.asList(estadistica));

		webTestClient.get().uri("/resultados/estadisticas")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].departamento").isEqualTo("La Paz");
	}

	@Test
	void testEstadisticaDeDepartamento() {
		when(resultadosService.estadisticaDe(anyString())).thenReturn(estadistica);

		webTestClient.get().uri("/resultados/estadisticas/La Paz")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$.departamento").isEqualTo("La Paz")
			.jsonPath("$.totalVotantes").isEqualTo(300);
	}
}


