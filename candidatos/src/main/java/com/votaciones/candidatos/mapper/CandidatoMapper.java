package com.votaciones.candidatos.mapper;

import com.votaciones.candidatos.dto.CandidatoCreacionDto;
import com.votaciones.candidatos.dto.CandidatoCargaDto;
import com.votaciones.candidatos.dto.candidatosDto;
import com.votaciones.candidatos.model.Candidato;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * Mapper para convertir entre Candidato (entidad) y sus DTOs
 */
@Mapper(componentModel = "spring")
public interface CandidatoMapper {

	CandidatoMapper INSTANCE = Mappers.getMapper(CandidatoMapper.class);

	/**
	 * Convierte un DTO de creación a entidad Candidato
	 */
	Candidato toEntity(CandidatoCreacionDto dto);

	/**
	 * Convierte un DTO de carga a entidad Candidato
	 */
	Candidato toEntity(CandidatoCargaDto dto);

	/**
	 * Convierte una entidad Candidato a DTO
	 */
	candidatosDto toDto(Candidato candidato);

	/**
	 * Convierte una entidad Candidato a candidatosDto
	 */
	candidatosDto toCandidatoDto(Candidato candidato);
}
