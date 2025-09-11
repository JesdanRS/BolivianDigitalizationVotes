package com.votaciones.resultados_estadisticas.service;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ResultadosServiceTest {

	private ResultadosService resultadosService;

	@BeforeEach
	void setUp() {
		resultadosService = new ResultadosService();
	}

	@Test
	void testListarResultadosNoVacio() {
		var lista = resultadosService.listarResultados();
		assertNotNull(lista);
		assertFalse(lista.isEmpty());
	}

	@Test
	void testListarPorDepartamento() {
		var listaLaPaz = resultadosService.listarPorDepartamento("La Paz");
		assertNotNull(listaLaPaz);
		assertFalse(listaLaPaz.isEmpty());
		assertTrue(listaLaPaz.stream().allMatch(r -> "La Paz".equalsIgnoreCase(r.getDepartamento())));
	}

	@Test
	void testEstadisticasPorDepartamento() {
		var resumen = resultadosService.estadisticasPorDepartamento();
		assertNotNull(resumen);
		assertFalse(resumen.isEmpty());
	}

	@Test
	void testEstadisticaDeDepartamento() {
		EstadisticaDto dto = resultadosService.estadisticaDe("La Paz");
		assertNotNull(dto);
		assertEquals("La Paz", dto.getDepartamento());
		assertTrue(dto.getTotalVotantes() > 0);
	}
}


