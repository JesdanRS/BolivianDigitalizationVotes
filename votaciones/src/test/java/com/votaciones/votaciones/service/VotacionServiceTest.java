package com.votaciones.votaciones.service;

import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.exception.RecursoNoEncontradoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class VotacionServiceTest {

	private VotacionService votacionService;

	@BeforeEach
	void setUp() {
		votacionService = new VotacionService();
	}

	@Test
	void testCrearVotacionExitoso() {
		VotacionCreacionDto dto = new VotacionCreacionDto();
		dto.setPartido("Movimiento al Socialismo");
		dto.setCandidato("Juan Pérez");
		dto.setLocalidad("La Paz");
		dto.setFecha(Instant.parse("2025-09-10T10:30:00Z"));

		VotacionDto resultado = votacionService.crear(dto);

		assertNotNull(resultado);
		assertNotNull(resultado.getId());
		assertEquals("Movimiento al Socialismo", resultado.getPartido());
		assertEquals("Juan Pérez", resultado.getCandidato());
		assertEquals("La Paz", resultado.getLocalidad());
		assertEquals(Instant.parse("2025-09-10T10:30:00Z"), resultado.getFecha());
		assertNotNull(resultado.getCreadoEn());
		assertNotNull(resultado.getActualizadoEn());
	}

	@Test
	void testObtenerVotacionPorIdExitoso() {
		Long idExistente = 1L;
		VotacionDto resultado = votacionService.obtenerPorId(idExistente);
		assertNotNull(resultado);
		assertEquals(idExistente, resultado.getId());
	}

	@Test
	void testObtenerVotacionPorIdNoEncontrado() {
		Long idNoExistente = 999L;
		assertThrows(RecursoNoEncontradoException.class, () -> votacionService.obtenerPorId(idNoExistente));
	}

	@Test
	void testListarVotaciones() {
		var lista = votacionService.listar();
		assertNotNull(lista);
		assertFalse(lista.isEmpty());
		assertEquals(3, lista.size());
	}

	@Test
	void testBuscarPorLocalidad() {
		var lista = votacionService.buscarPorLocalidad("La Paz");
		assertNotNull(lista);
		assertFalse(lista.isEmpty());
		assertTrue(lista.stream().allMatch(v -> "La Paz".equals(v.getLocalidad())));
	}

	@Test
	void testBuscarPorLocalidadNoEncontrado() {
		var lista = votacionService.buscarPorLocalidad("Tarija");
		assertNotNull(lista);
		assertTrue(lista.isEmpty());
	}
}


