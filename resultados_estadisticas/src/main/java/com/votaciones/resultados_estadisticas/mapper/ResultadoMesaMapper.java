package com.votaciones.resultados_estadisticas.mapper;

import com.votaciones.resultados_estadisticas.dto.ResultadoMesaDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaCreacionDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaActualizacionDto;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ResultadoMesaMapper {

    // Mapea de Entidad ResultadoMesa -> ResultadoMesaDto (para respuestas de la API)
    ResultadoMesaDto toDto(ResultadoMesa resultadoMesa);

    // Mapea de ResultadoMesaCreacionDto -> Entidad ResultadoMesa (para crear)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registradoEn", ignore = true)
    @Mapping(target = "actualizadoEn", ignore = true)
    ResultadoMesa toEntity(ResultadoMesaCreacionDto dto);

    // Actualiza una entidad existente con datos del DTO de actualización
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registradoEn", ignore = true)
    @Mapping(target = "actualizadoEn", ignore = true)
    void updateEntityFromDto(ResultadoMesaActualizacionDto dto, @MappingTarget ResultadoMesa resultadoMesa);
}
