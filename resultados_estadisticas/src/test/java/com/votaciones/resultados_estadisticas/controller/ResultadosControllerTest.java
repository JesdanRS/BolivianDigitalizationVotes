package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.service.ResultadosService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ResultadosControllerTest {

	@Autowired
	private MockMvc mockMvc;

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
	void testListarResultados() throws Exception {
		when(resultadosService.listarResultados()).thenReturn(Arrays.asList(muestra));

		mockMvc.perform(get("/resultados"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isArray())
			.andExpect(jsonPath("$[0].departamento").value("La Paz"));
	}

	@Test
	void testResultadosPorDepartamento() throws Exception {
		when(resultadosService.listarPorDepartamento("La Paz")).thenReturn(Arrays.asList(muestra));

		mockMvc.perform(get("/resultados/departamento/La Paz"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isArray())
			.andExpect(jsonPath("$[0].departamento").value("La Paz"));
	}

	@Test
	void testEstadisticasPorDepartamento() throws Exception {
		when(resultadosService.estadisticasPorDepartamento()).thenReturn(Arrays.asList(estadistica));

		mockMvc.perform(get("/resultados/estadisticas"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isArray())
			.andExpect(jsonPath("$[0].departamento").value("La Paz"));
	}

	@Test
	void testEstadisticaDeDepartamento() throws Exception {
		when(resultadosService.estadisticaDe(anyString())).thenReturn(estadistica);

		mockMvc.perform(get("/resultados/estadisticas/La Paz"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.departamento").value("La Paz"))
			.andExpect(jsonPath("$.totalVotantes").value(300));
	}
}


