package com.votaciones.candidatos.service;

import com.votaciones.dto.candidatos.CandidatoDto;
import com.votaciones.candidatos.exception.RecursoNoEncontradoException;
import com.votaciones.candidatos.mapper.CandidatoMapper;
import com.votaciones.candidatos.model.Candidato;
import com.votaciones.candidatos.repository.CandidatoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio CRUD para la gestión de candidatos en el sistema de votaciones bolivianas
 */
@Service
@Slf4j
public class CandidatoService {

	private final CandidatoRepository candidatoRepository;
	private final CandidatoMapper candidatoMapper;

	@Autowired
	public CandidatoService(CandidatoRepository candidatoRepository, CandidatoMapper candidatoMapper) {
		this.candidatoRepository = candidatoRepository;
		this.candidatoMapper = candidatoMapper;
	}

	/**
	 * Obtiene todas las candidaturas registradas
	 */
	@Transactional(readOnly = true)
	public List<CandidatoDto> listarTodos() {
		log.info("Listando todas las candidaturas");
		return candidatoRepository.findAll().stream()
			.map(candidatoMapper::toDto)
			.toList();
	}

	/**
	 * Obtiene una candidatura por su ID
	 */
	@Transactional(readOnly = true)
	public CandidatoDto obtenerPorId(Long id) {
		log.info("Obteniendo candidatura con ID: {}", id);
		Candidato candidato = candidatoRepository.findById(id)
			.orElseThrow(() -> new RecursoNoEncontradoException("Candidatura no encontrada con ID: " + id));
		return candidatoMapper.toDto(candidato);
	}

	/**
	 * Crea una nueva candidatura
	 */
	@Transactional
	public CandidatoDto crear(CandidatoDto candidatoDto) {
		log.info("Creando nueva candidatura: {}", candidatoDto.getNombreCompletoPresidente());
		Candidato candidato = new Candidato();
		candidato.setPartido(candidatoDto.getPartido());
		candidato.setNombreCompletoPresidente(candidatoDto.getNombreCompletoPresidente());
		candidato.setNombreCompletoVicepresidente(candidatoDto.getNombreCompletoVicepresidente());
		candidato.setCarnetPresidente(candidatoDto.getCarnetPresidente());
		candidato.setCarnetVicepresidente(candidatoDto.getCarnetVicepresidente());
		candidato.setFechaNacimientoPresidente(candidatoDto.getFechaNacimientoPresidente());
		candidato.setFechaNacimientoVicepresidente(candidatoDto.getFechaNacimientoVicepresidente());
		candidato.setCorreoElectronico(candidatoDto.getCorreoElectronico());
		candidato.setDescripcion(candidatoDto.getDescripcion());
		
		Candidato guardado = candidatoRepository.save(candidato);
		log.info("Candidatura creada exitosamente con ID: {}", guardado.getId());
		return candidatoMapper.toDto(guardado);
	}

	/**
	 * Actualiza una candidatura existente
	 */
	@Transactional
	public CandidatoDto actualizar(Long id, CandidatoDto candidatoDto) {
		log.info("Actualizando candidatura con ID: {}", id);
		Candidato candidato = candidatoRepository.findById(id)
			.orElseThrow(() -> new RecursoNoEncontradoException("Candidatura no encontrada con ID: " + id));

		if (candidatoDto.getPartido() != null) {
			candidato.setPartido(candidatoDto.getPartido());
		}
		if (candidatoDto.getNombreCompletoPresidente() != null) {
			candidato.setNombreCompletoPresidente(candidatoDto.getNombreCompletoPresidente());
		}
		if (candidatoDto.getNombreCompletoVicepresidente() != null) {
			candidato.setNombreCompletoVicepresidente(candidatoDto.getNombreCompletoVicepresidente());
		}
		if (candidatoDto.getCorreoElectronico() != null) {
			candidato.setCorreoElectronico(candidatoDto.getCorreoElectronico());
		}
		if (candidatoDto.getDescripcion() != null) {
			candidato.setDescripcion(candidatoDto.getDescripcion());
		}

		Candidato actualizado = candidatoRepository.save(candidato);
		log.info("Candidatura actualizada exitosamente: {}", id);
		return candidatoMapper.toDto(actualizado);
	}

	/**
	 * Elimina una candidatura
	 */
	@Transactional
	public void eliminar(Long id) {
		log.info("Eliminando candidatura con ID: {}", id);
		if (!candidatoRepository.existsById(id)) {
			throw new RecursoNoEncontradoException("Candidatura no encontrada con ID: " + id);
		}
		candidatoRepository.deleteById(id);
		log.info("Candidatura eliminada exitosamente: {}", id);
	}
}


