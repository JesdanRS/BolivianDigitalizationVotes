package com.votaciones.votaciones.service;

import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.exception.RecursoNoEncontradoException;
import com.votaciones.votaciones.model.Votacion;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class VotacionService {

	private final List<Votacion> votaciones = new ArrayList<>();
	private final AtomicLong contadorId = new AtomicLong(1);

	public VotacionService() {
		inicializarDatosEjemplo();
	}

	public VotacionDto crear(VotacionCreacionDto dto) {
		Votacion v = new Votacion(
			dto.getPartido(),
			dto.getCandidato(),
			dto.getLocalidad(),
			dto.getFecha()
		);
		v.setId(contadorId.getAndIncrement());
		v.prePersist();
		votaciones.add(v);
		return VotacionDto.fromVotacion(v);
	}

	public VotacionDto obtenerPorId(Long id) {
		Votacion v = votaciones.stream()
			.filter(x -> x.getId().equals(id))
			.findFirst()
			.orElseThrow(() -> new RecursoNoEncontradoException("Votación", id));
		return VotacionDto.fromVotacion(v);
	}

	public List<VotacionDto> listar() {
		return votaciones.stream().map(VotacionDto::fromVotacion).toList();
	}

	public List<VotacionDto> buscarPorLocalidad(String localidad) {
		return votaciones.stream()
			.filter(v -> v.getLocalidad().equalsIgnoreCase(localidad))
			.map(VotacionDto::fromVotacion)
			.toList();
	}

	private void inicializarDatosEjemplo() {
		Votacion v1 = new Votacion("Movimiento al Socialismo", "María Quispe", "La Paz", Instant.parse("2025-09-10T10:30:00Z"));
		v1.setId(contadorId.getAndIncrement());
		v1.prePersist();
		votaciones.add(v1);

		Votacion v2 = new Votacion("Comunidad Ciudadana", "Carlos Rojas", "Santa Cruz", Instant.parse("2025-09-10T11:00:00Z"));
		v2.setId(contadorId.getAndIncrement());
		v2.prePersist();
		votaciones.add(v2);

		Votacion v3 = new Votacion("Creemos", "Ana Flores", "Cochabamba", Instant.parse("2025-09-10T12:15:00Z"));
		v3.setId(contadorId.getAndIncrement());
		v3.prePersist();
		votaciones.add(v3);
	}
}


