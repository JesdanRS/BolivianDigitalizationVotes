// Ubicación: dto-usuarios/src/main/java/com/votaciones/usuarios/dto/LoginRequestDto.java
package com.votaciones;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Schema(name = "LoginRequest", description = "Credenciales para la autenticación del votante")
@Data
public class LoginRequestDto {

    @Schema(description = "Número de carnet de identidad", example = "12345678LP", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "El carnet de identidad es obligatorio")
    private String carnet;

    @Schema(description = "Fecha de nacimiento del votante", example = "1990-05-15", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;
}