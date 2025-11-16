package main.java.com.votaciones.dto.candidatos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO para la autenticación de candidatos
 */
@Schema(name = "LoginRequestDto", description = "Credenciales para autenticar a una fórmula de candidatos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDto {

	@Schema(description = "Carnet de identidad del presidente", example = "1234567", required = true)
	@NotBlank(message = "El carnet del Presidente es obligatorio")
	private String carnetPresidente;

	@Schema(description = "Fecha de nacimiento del presidente", example = "1965-09-28", required = true)
	@NotNull(message = "La fecha de nacimiento del Presidente es obligatoria")
	private LocalDate fechaNacimientoPresidente;
}
