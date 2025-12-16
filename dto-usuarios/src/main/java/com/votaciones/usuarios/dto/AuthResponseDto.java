// Ubicación: dto-usuarios/src/main/java/com/votaciones/usuarios/dto/AuthResponseDto.java
package com.votaciones.usuarios.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(name = "AuthResponse", description = "Respuesta de autenticación con email oculto")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {

    @Schema(description = "Indica si la autenticación fue exitosa", example = "true")
    private boolean success;

    @Schema(description = "Email parcialmente oculto del usuario", example = "j***@gmail.com")
    private String emailOculto;

    @Schema(description = "Mensaje informativo", example = "Código de verificación enviado")
    private String message;

    @Schema(description = "Carnet del usuario autenticado", example = "13120200")
    private String carnet;
}
