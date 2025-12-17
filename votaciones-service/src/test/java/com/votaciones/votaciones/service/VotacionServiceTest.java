package com.votaciones.votaciones.service;

import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.exception.RecursoNoEncontradoException;
import com.votaciones.votaciones.mapper.VotacionMapper;
import com.votaciones.votaciones.model.Votacion;
import com.votaciones.votaciones.repository.VotacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.stream.function.StreamBridge;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VotacionServiceTest {

	@Mock
	private VotacionRepository votacionRepository;

	@Mock
	private VotacionMapper votacionMapper;

	@Mock
	private StreamBridge streamBridge;

	@Mock
	private com.votaciones.votaciones.client.UsuarioServiceClient usuarioServiceClient;

	@InjectMocks
	private VotacionService votacionService;

	private Votacion votacion;
	private VotacionDto votacionDto;
	private VotacionCreacionDto creacionDto;

	@BeforeEach
	void setUp() {
		votacion = new Votacion();
		votacion.setId(1L);
		votacion.setPartido("Movimiento al Socialismo");
		votacion.setCandidato("Juan Pérez");
		votacion.setLocalidad("La Paz");
		votacion.setFecha(Instant.parse("2025-09-10T10:30:00Z"));
		votacion.setCreadoEn(Instant.now());
		votacion.setActualizadoEn(Instant.now());

		votacionDto = new VotacionDto();
		votacionDto.setId(1L);
		votacionDto.setPartido("Movimiento al Socialismo");
		votacionDto.setCandidato("Juan Pérez");
		votacionDto.setLocalidad("La Paz");
		votacionDto.setFecha(Instant.parse("2025-09-10T10:30:00Z"));
		votacionDto.setCreadoEn(Instant.now());
		votacionDto.setActualizadoEn(Instant.now());

		creacionDto = new VotacionCreacionDto();
		creacionDto.setPartido("Movimiento al Socialismo");
		creacionDto.setCandidato("Juan Pérez");
		creacionDto.setLocalidad("La Paz");
		creacionDto.setFecha(Instant.parse("2025-09-10T10:30:00Z"));
	}

	@Test
	void testCrearVotacionExitoso() {
		when(votacionMapper.toEntity(any(VotacionCreacionDto.class))).thenReturn(votacion);
		when(votacionRepository.save(any(Votacion.class))).thenReturn(votacion);
		when(votacionMapper.toDto(any(Votacion.class))).thenReturn(votacionDto);
        doNothing().when(usuarioServiceClient).marcarUsuarioComoVotado(anyString());

		VotacionDto resultado = votacionService.crear(creacionDto, "1234567");

		assertNotNull(resultado);
		assertEquals(1L, resultado.getId());
		assertEquals("Movimiento al Socialismo", resultado.getPartido());
		assertEquals("Juan Pérez", resultado.getCandidato());
		assertEquals("La Paz", resultado.getLocalidad());
		
		verify(votacionMapper).toEntity(any(VotacionCreacionDto.class));
		verify(votacionRepository).save(any(Votacion.class));
		verify(votacionMapper).toDto(any(Votacion.class));
        verify(usuarioServiceClient).marcarUsuarioComoVotado("1234567");
	}

	@Test
	void testObtenerVotacionPorIdExitoso() {
		when(votacionRepository.findById(1L)).thenReturn(Optional.of(votacion));
		when(votacionMapper.toDto(any(Votacion.class))).thenReturn(votacionDto);

		VotacionDto resultado = votacionService.obtenerPorId(1L);

		assertNotNull(resultado);
		assertEquals(1L, resultado.getId());
		verify(votacionRepository).findById(1L);
	}

	@Test
	void testObtenerVotacionPorIdNoEncontrado() {
		when(votacionRepository.findById(999L)).thenReturn(Optional.empty());

		assertThrows(RecursoNoEncontradoException.class, () -> votacionService.obtenerPorId(999L));
		verify(votacionRepository).findById(999L);
	}

	@Test
	void testListarVotaciones() {
		List<Votacion> votaciones = Arrays.asList(votacion);
		when(votacionRepository.findAll()).thenReturn(votaciones);
		when(votacionMapper.toDto(any(Votacion.class))).thenReturn(votacionDto);

		var lista = votacionService.listar();

		assertNotNull(lista);
		assertFalse(lista.isEmpty());
		assertEquals(1, lista.size());
		verify(votacionRepository).findAll();
	}

	@Test
	void testBuscarPorLocalidad() {
		List<Votacion> votaciones = Arrays.asList(votacion);
		when(votacionRepository.findByLocalidadIgnoreCase("La Paz")).thenReturn(votaciones);
		when(votacionMapper.toDto(any(Votacion.class))).thenReturn(votacionDto);

		var lista = votacionService.buscarPorLocalidad("La Paz");

		assertNotNull(lista);
		assertFalse(lista.isEmpty());
		verify(votacionRepository).findByLocalidadIgnoreCase("La Paz");
	}

	@Test
	void testBuscarPorLocalidadNoEncontrado() {
		when(votacionRepository.findByLocalidadIgnoreCase("Tarija")).thenReturn(Arrays.asList());

		var lista = votacionService.buscarPorLocalidad("Tarija");

		assertNotNull(lista);
		assertTrue(lista.isEmpty());
		verify(votacionRepository).findByLocalidadIgnoreCase("Tarija");
	}
}


