// Ubicación: dto-usuarios/src/main/java/com/votaciones/usuarios/dto/UsuarioCargaDto.java
package com.votaciones.usuarios.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDate;

@Schema(name = "UsuarioCarga", description = "Datos de un ciudadano para la carga masiva desde el padrón electoral")
@Data
public class UsuarioCargaDto {

    @Schema(description = "Número de carnet de identidad único", requiredMode = Schema.RequiredMode.REQUIRED)
    private String carnet;

    @Schema(description = "Nombre completo del ciudadano", requiredMode = Schema.RequiredMode.REQUIRED)
    private String nombreCompleto;

    @Schema(description = "Fecha de nacimiento del ciudadano", example = "1990-05-15", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate fechaNacimiento;

    @Schema(description = "Departamento de registro del ciudadano", requiredMode = Schema.RequiredMode.REQUIRED)
    private String departamento;
    
    // Otros campos que puedan venir del padrón...
    // private String direccion;
}