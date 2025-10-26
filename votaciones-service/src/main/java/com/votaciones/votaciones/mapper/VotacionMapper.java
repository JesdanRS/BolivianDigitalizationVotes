package com.votaciones.votaciones.mapper;

import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.model.Votacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VotacionMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creadoEn", ignore = true)
    @Mapping(target = "actualizadoEn", ignore = true)
    Votacion toEntity(VotacionCreacionDto dto);
    
    VotacionDto toDto(Votacion entity);
}
