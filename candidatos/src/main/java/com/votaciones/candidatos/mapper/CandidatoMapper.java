package com.votaciones.candidatos.mapper;

import com.votaciones.dto.candidatos.CandidatoCreacionDto;
import com.votaciones.dto.candidatos.CandidatoCargaDto;
import com.votaciones.dto.candidatos.CandidatoDto;
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
	CandidatoDto toDto(Candidato candidato);

	/**
	 * Convierte una entidad Candidato a CandidatoDto
	 */
	CandidatoDto toCandidatoDto(Candidato candidato);
}
