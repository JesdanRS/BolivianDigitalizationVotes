package com.votaciones.candidatos.service;

import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.exception.RecursoNoEncontradoException;
import com.votaciones.candidatos.mapper.CandidatoMapper;
import com.votaciones.candidatos.model.Candidato;
import com.votaciones.candidatos.repository.CandidatoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.springframework.test.context.ActiveProfiles;

/**
 * Tests unitarios para el servicio CRUD de candidatos
 */
@SpringBootTest(properties = {
	"spring.cloud.function.enabled=false",
	"spring.cloud.stream.enabled=false"
})
@ActiveProfiles("test")
public class CandidatoServiceTest {

	private CandidatoService candidatoService;

	@MockBean
	private CandidatoRepository candidatoRepository;

	@MockBean
	private CandidatoMapper candidatoMapper;

	@BeforeEach
	void setUp() {
		candidatoService = new CandidatoService(candidatoRepository, candidatoMapper);
	}

	@Test
	void testListarTodosExitoso() {
		// Given
		Candidato candidato1 = new Candidato();
		candidato1.setId(1L);
		candidato1.setPartido("MAS");

		Candidato candidato2 = new Candidato();
		candidato2.setId(2L);
		candidato2.setPartido("CC");

		candidatosDto dto1 = new candidatosDto();
		dto1.setId(1L);
		dto1.setPartido("MAS");

		candidatosDto dto2 = new candidatosDto();
		dto2.setId(2L);
		dto2.setPartido("CC");

		when(candidatoRepository.findAll()).thenReturn(List.of(candidato1, candidato2));
		when(candidatoMapper.toDto(candidato1)).thenReturn(dto1);
		when(candidatoMapper.toDto(candidato2)).thenReturn(dto2);

		// When
		List<candidatosDto> resultado = candidatoService.listarTodos();

		// Then
		assertNotNull(resultado);
		assertEquals(2, resultado.size());
		verify(candidatoRepository).findAll();
	}

	@Test
	void testObtenerPorIdExitoso() {
		// Given
		Candidato candidato = new Candidato();
		candidato.setId(1L);
		candidato.setPartido("MAS");

		candidatosDto esperado = new candidatosDto();
		esperado.setId(1L);
		esperado.setPartido("MAS");

		when(candidatoRepository.findById(1L)).thenReturn(Optional.of(candidato));
		when(candidatoMapper.toDto(candidato)).thenReturn(esperado);

		// When
		candidatosDto resultado = candidatoService.obtenerPorId(1L);

		// Then
		assertNotNull(resultado);
		assertEquals(1L, resultado.getId());
		assertEquals("MAS", resultado.getPartido());
	}

	@Test
	void testObtenerPorIdNoEncontrado() {
		// Given
		when(candidatoRepository.findById(999L)).thenReturn(Optional.empty());

		// When & Then
		assertThrows(RecursoNoEncontradoException.class, () -> {
			candidatoService.obtenerPorId(999L);
		});
	}

	@Test
	void testCrearCandidatoExitoso() {
		// Given
		candidatosDto inputDto = new candidatosDto();
		inputDto.setNombreCompletoPresidente("Luis Arce");
		inputDto.setCarnetPresidente("12345678");
		inputDto.setPartido("MAS");

		Candidato candidatoGuardado = new Candidato();
		candidatoGuardado.setId(1L);
		candidatoGuardado.setNombreCompletoPresidente("Luis Arce");
		candidatoGuardado.setCarnetPresidente("12345678");
		candidatoGuardado.setPartido("MAS");

		candidatosDto outputDto = new candidatosDto();
		outputDto.setId(1L);
		outputDto.setNombreCompletoPresidente("Luis Arce");
		outputDto.setPartido("MAS");

		when(candidatoRepository.save(any(Candidato.class))).thenReturn(candidatoGuardado);
		when(candidatoMapper.toDto(candidatoGuardado)).thenReturn(outputDto);

		// When
		candidatosDto resultado = candidatoService.crear(inputDto);

		// Then
		assertNotNull(resultado);
		assertEquals(1L, resultado.getId());
		assertEquals("Luis Arce", resultado.getNombreCompletoPresidente());
		verify(candidatoRepository).save(any(Candidato.class));
	}

	@Test
	void testActualizarCandidatoExitoso() {
		// Given
		candidatosDto updateDto = new candidatosDto();
		updateDto.setNombreCompletoPresidente("Luis Alberto Arce Catacora");
		updateDto.setCorreoElectronico("luis@mas.bo");

		Candidato candidatoExistente = new Candidato();
		candidatoExistente.setId(1L);
		candidatoExistente.setNombreCompletoPresidente("Luis Arce");
		candidatoExistente.setCorreoElectronico("old@email.com");

		Candidato candidatoActualizado = new Candidato();
		candidatoActualizado.setId(1L);
		candidatoActualizado.setNombreCompletoPresidente("Luis Alberto Arce Catacora");
		candidatoActualizado.setCorreoElectronico("luis@mas.bo");

		candidatosDto outputDto = new candidatosDto();
		outputDto.setId(1L);
		outputDto.setNombreCompletoPresidente("Luis Alberto Arce Catacora");
		outputDto.setCorreoElectronico("luis@mas.bo");

		when(candidatoRepository.findById(1L)).thenReturn(Optional.of(candidatoExistente));
		when(candidatoRepository.save(any(Candidato.class))).thenReturn(candidatoActualizado);
		when(candidatoMapper.toDto(candidatoActualizado)).thenReturn(outputDto);

		// When
		candidatosDto resultado = candidatoService.actualizar(1L, updateDto);

		// Then
		assertNotNull(resultado);
		assertEquals("Luis Alberto Arce Catacora", resultado.getNombreCompletoPresidente());
		assertEquals("luis@mas.bo", resultado.getCorreoElectronico());
		verify(candidatoRepository).findById(1L);
		verify(candidatoRepository).save(any(Candidato.class));
	}

	@Test
	void testEliminarCandidatoExitoso() {
		// Given
		when(candidatoRepository.existsById(1L)).thenReturn(true);

		// When
		assertDoesNotThrow(() -> candidatoService.eliminar(1L));

		// Then
		verify(candidatoRepository).existsById(1L);
		verify(candidatoRepository).deleteById(1L);
	}

	@Test
	void testEliminarCandidatoNoEncontrado() {
		// Given
		when(candidatoRepository.existsById(999L)).thenReturn(false);

		// When & Then
		assertThrows(RecursoNoEncontradoException.class, () -> {
			candidatoService.eliminar(999L);
		});
	}
}


