// Ubicación: dto-usuarios/src/main/java/com/votaciones/usuarios/dto/VerificacionCodigoDto.java
package com.votaciones.usuarios.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(name = "VerificacionCodigo", description = "DTO para validar el código recibido por correo")
@Data
public class VerificacionCodigoDto {

    @Schema(description = "Código de 6 dígitos recibido por el usuario", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank
    private String codigo;
}