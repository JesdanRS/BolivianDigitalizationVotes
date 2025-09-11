package com.votaciones.candidatos.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.votaciones.candidatos.dto.CandidatoCreacionDto;
import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.model.Candidato;
import com.votaciones.candidatos.exception.RecursoNoEncontradoException;

@Service
public class CandidatoService {

	private final List<Candidato> candidatos = new ArrayList<>();
	private final AtomicLong contadorId = new AtomicLong(1);

	public CandidatoService() {
		inicializarDatosEjemplo();
	}

	public candidatosDto crearCandidato(CandidatoCreacionDto dto) {
		Candidato c = new Candidato(
			dto.getPartido(),
			dto.getNombreCompletoPresidente(),
			dto.getNombreCompletoVicepresidente(),
			dto.getDescripcion()
		);
		c.setIdCandidato(contadorId.getAndIncrement());
		c.prePersist();
		candidatos.add(c);
		return candidatosDto.fromCandidato(c);
	}

	public candidatosDto obtenerPorId(Long id) {
		return candidatos.stream()
			.filter(c -> c.getIdCandidato().equals(id))
			.findFirst()
			.map(candidatosDto::fromCandidato)
			.orElseThrow(() -> new RecursoNoEncontradoException("Candidato", id));
	}

	public List<candidatosDto> listar() {
		return candidatos.stream()
			.map(candidatosDto::fromCandidato)
			.collect(Collectors.toList());
	}

	public List<candidatosDto> buscarPorPartido(String partido) {
		return candidatos.stream()
			.filter(c -> c.getPartido().equalsIgnoreCase(partido))
			.map(candidatosDto::fromCandidato)
			.collect(Collectors.toList());
	}

	private void inicializarDatosEjemplo() {
		Candidato c1 = new Candidato(
			"Movimiento al Socialismo (MAS)",
			"Luis Alberto Arce Catacora",
			"David Choquehuanca Céspedes",
			"Propuesta enfocada en estabilidad económica y social"
		);
		c1.setIdCandidato(contadorId.getAndIncrement());
		c1.prePersist();
		candidatos.add(c1);

		Candidato c2 = new Candidato(
			"Comunidad Ciudadana (CC)",
			"Carlos Diego Mesa Gisbert",
			"Gustavo Pedraza",
			"Agenda de institucionalidad democrática y desarrollo sostenible"
		);
		c2.setIdCandidato(contadorId.getAndIncrement());
		c2.prePersist();
		candidatos.add(c2);

		Candidato c3 = new Candidato(
			"Creemos",
			"Luis Fernando Camacho",
			"Marco Antonio Pumari",
			"Enfoque en libre empresa y autonomías regionales"
		);
		c3.setIdCandidato(contadorId.getAndIncrement());
		c3.prePersist();
		candidatos.add(c3);
	}
}


