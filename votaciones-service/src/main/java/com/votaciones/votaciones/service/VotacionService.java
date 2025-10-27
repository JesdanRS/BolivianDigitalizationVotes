package com.votaciones.votaciones.service;

import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.exception.RecursoNoEncontradoException;
import com.votaciones.votaciones.mapper.VotacionMapper;
import com.votaciones.votaciones.model.Votacion;
import com.votaciones.votaciones.repository.VotacionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VotacionService {

	private final VotacionRepository votacionRepository;
	private final VotacionMapper votacionMapper;
	private final StreamBridge streamBridge;

	@Transactional
	public VotacionDto crear(VotacionCreacionDto dto) {
		Votacion votacion = votacionMapper.toEntity(dto);
		Votacion guardada = votacionRepository.save(votacion);
		
		// Enviar notificación a Kafka cuando se registra una nueva votación
		enviarNotificacionVotacion(guardada);
		
		return votacionMapper.toDto(guardada);
	}
	
	/**
	 * Envía una notificación a Kafka cuando se registra una nueva votación
	 */
	private void enviarNotificacionVotacion(Votacion votacion) {
		var notificacion = new com.votaciones.notificaciones.dto.NotificacionDto(
			"admin@votaciones.bo", // Email del administrador o sistema
			"Nueva Votación Registrada",
			String.format("Se ha registrado una nueva votación:\n" +
				"Partido: %s\n" +
				"Candidato: %s\n" +
				"Localidad: %s\n" +
				"Fecha: %s",
				votacion.getPartido(),
				votacion.getCandidato(),
				votacion.getLocalidad(),
				votacion.getFecha())
		);
		
		streamBridge.send("enviarNotificacionVotacion-out-0", notificacion);
		log.info("Notificación de votación ID {} enviada a Kafka.", votacion.getId());
	}

	@Transactional(readOnly = true)
	public VotacionDto obtenerPorId(Long id) {
		Votacion votacion = votacionRepository.findById(id)
			.orElseThrow(() -> new RecursoNoEncontradoException("Votación", id));
		return votacionMapper.toDto(votacion);
	}

	@Transactional(readOnly = true)
	public List<VotacionDto> listar() {
		return votacionRepository.findAll().stream()
			.map(votacionMapper::toDto)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<VotacionDto> buscarPorLocalidad(String localidad) {
		return votacionRepository.findByLocalidadIgnoreCase(localidad).stream()
			.map(votacionMapper::toDto)
			.collect(Collectors.toList());
	}
}


