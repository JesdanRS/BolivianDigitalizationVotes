// Ubicación: dto-usuarios/src/main/java/com/votaciones/usuarios/dto/SolicitudCodigoDto.java
package com.votaciones;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(name = "SolicitudCodigo", description = "DTO para solicitar un código de verificación por correo")
@Data
public class SolicitudCodigoDto {

    @Schema(description = "Correo electrónico donde se enviará el código", example = "votante@email.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Email
    private String correoElectronico;
}