package com.votaciones.dto.candidatos;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para verificar código de verificación
 */
@Schema(name = "VerificacionCodigoDto", description = "DTO para verificar el código enviado al correo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificacionCodigoDto {

	@Schema(description = "Código de verificación de 6 dígitos", example = "123456", required = true)
	@NotBlank(message = "El código de verificación es obligatorio")
	private String codigo;
}
