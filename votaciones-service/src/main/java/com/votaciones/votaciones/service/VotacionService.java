package com.votaciones.votaciones.service;

import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.exception.RecursoNoEncontradoException;
import com.votaciones.votaciones.mapper.VotacionMapper;
import com.votaciones.votaciones.model.Votacion;
import com.votaciones.votaciones.repository.VotacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VotacionService {

	private final VotacionRepository votacionRepository;
	private final VotacionMapper votacionMapper;

	@Transactional
	public VotacionDto crear(VotacionCreacionDto dto) {
		Votacion votacion = votacionMapper.toEntity(dto);
		Votacion guardada = votacionRepository.save(votacion);
		return votacionMapper.toDto(guardada);
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


