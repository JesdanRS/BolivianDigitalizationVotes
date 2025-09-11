package com.votaciones.candidatos.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.votaciones.candidatos.dto.CandidatoCreacionDto;
import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.exception.RecursoNoEncontradoException;
import com.votaciones.candidatos.exception.PartidoDuplicadoException;
import com.votaciones.candidatos.exception.NombreDuplicadoException;

@SpringBootTest
public class CandidatoServiceTest {

	private CandidatoService candidatoService;

	@BeforeEach
	void setUp() {
		candidatoService = new CandidatoService();
	}

	@Test
	void testCrearCandidatoExitoso() {
		CandidatoCreacionDto dto = new CandidatoCreacionDto();
		dto.setPartido("MAS");
		dto.setNombreCompletoPresidente("Presidente Test");
		dto.setNombreCompletoVicepresidente("Vicepresidente Test");
		dto.setDescripcion("Descripcion Test");

		candidatosDto creado = candidatoService.crearCandidato(dto);
		assertNotNull(creado);
		assertNotNull(creado.getIdCandidato());
		assertEquals("MAS", creado.getPartido());
	}

	@Test
	void testCrearCandidatoConPartidoDuplicado() {
		// Tomar un partido existente de datos de ejemplo
		CandidatoCreacionDto dto = new CandidatoCreacionDto();
		dto.setPartido("Movimiento al Socialismo (MAS)");
		dto.setNombreCompletoPresidente("Nuevo Presidente");
		dto.setNombreCompletoVicepresidente("Nuevo Vice");
		dto.setDescripcion("Desc");

		assertThrows(PartidoDuplicadoException.class, () -> candidatoService.crearCandidato(dto));
	}

	@Test
	void testCrearCandidatoConMismosNombres() {
		CandidatoCreacionDto dto = new CandidatoCreacionDto();
		dto.setPartido("Nuevo Partido");
		dto.setNombreCompletoPresidente("Persona Igual");
		dto.setNombreCompletoVicepresidente("Persona Igual");
		dto.setDescripcion("Desc");

		assertThrows(NombreDuplicadoException.class, () -> candidatoService.crearCandidato(dto));
	}

	@Test
	void testObtenerPorIdExitoso() {
		candidatosDto existente = candidatoService.obtenerPorId(1L);
		assertNotNull(existente);
		assertEquals(1L, existente.getIdCandidato());
	}

	@Test
	void testObtenerPorIdNoEncontrado() {
		assertThrows(RecursoNoEncontradoException.class, () -> {
			candidatoService.obtenerPorId(999L);
		});
	}

	@Test
	void testListarYFiltrar() {
		var lista = candidatoService.listar();
		assertFalse(lista.isEmpty());

		var mas = candidatoService.buscarPorPartido("MAS");
		assertTrue(mas.stream().allMatch(c -> c.getPartido().toLowerCase().contains("mas")));
	}
}


