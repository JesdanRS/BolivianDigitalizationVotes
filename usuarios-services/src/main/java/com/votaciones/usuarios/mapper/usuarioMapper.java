package main.java.com.votaciones.usuarios.mapper;

import com.votaciones.usuarios.dto.UsuarioCargaDto;
import com.votaciones.usuarios.dto.UsuarioDto;
import com.votaciones.usuarios.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring") // Le dice a MapStruct que genere un Spring Bean
public interface UsuarioMapper {

    // Mapea de Entidad Usuario -> UsuarioDto (para respuestas de la API)
    UsuarioDto toDto(Usuario usuario);

    // Mapea de UsuarioCargaDto -> Entidad Usuario (para la carga masiva)
    @Mapping(target = "id", ignore = true) // Ignora el ID al crear desde un DTO
    @Mapping(target = "correoElectronico", ignore = true) // Ignora campos que no están en el DTO de carga
    @Mapping(target = "correoVerificado", ignore = true)
    @Mapping(target = "creadoEn", ignore = true)
    Usuario toEntity(UsuarioCargaDto dto);
}