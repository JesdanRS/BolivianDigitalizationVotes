package com.votaciones.resultados_estadisticas.service;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ResultadosServiceTest {

	@Autowired
	private ResultadosService resultadosService;

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


