package main.java.com.votaciones.dto.candidatos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO para la creación de candidatos en el sistema de votaciones bolivianas
 */
@Schema(name = "CandidatoCreacion", description = "Datos para crear una fórmula de candidatos nueva")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatoCreacionDto {

	@Schema(description = "Nombre del partido político", example = "Movimiento al Socialismo (MAS)", required = true)
	@NotBlank(message = "El partido es obligatorio")
	@Size(max = 50, message = "El partido no puede exceder 50 caracteres")
	private String partido;

	@Schema(description = "Nombre completo del candidato a presidente", example = "Luis Alberto Arce Catacora", required = true)
	@NotBlank(message = "El nombre completo del Presidente es obligatorio")
	@Size(max = 100, message = "El nombre del Presidente no puede exceder 100 caracteres")
	private String nombreCompletoPresidente;

	@Schema(description = "Nombre completo del candidato a vicepresidente", example = "David Choquehuanca Céspedes", required = true)
	@NotBlank(message = "El nombre completo del Vicepresidente es obligatorio")
	@Size(max = 100, message = "El nombre del Vicepresidente no puede exceder 100 caracteres")
	private String nombreCompletoVicepresidente;

	@Schema(description = "Carnet de identidad del presidente", example = "1234567", required = true)
	@NotBlank(message = "El carnet del Presidente es obligatorio")
	@Size(max = 20, message = "El carnet del Presidente no puede exceder 20 caracteres")
	private String carnetPresidente;

	@Schema(description = "Carnet de identidad del vicepresidente", example = "7654321", required = true)
	@NotBlank(message = "El carnet del Vicepresidente es obligatorio")
	@Size(max = 20, message = "El carnet del Vicepresidente no puede exceder 20 caracteres")
	private String carnetVicepresidente;

	@Schema(description = "Fecha de nacimiento del presidente", example = "1965-09-28", required = true)
	@NotNull(message = "La fecha de nacimiento del Presidente es obligatoria")
	private LocalDate fechaNacimientoPresidente;

	@Schema(description = "Fecha de nacimiento del vicepresidente", example = "1964-06-15", required = true)
	@NotNull(message = "La fecha de nacimiento del Vicepresidente es obligatoria")
	private LocalDate fechaNacimientoVicepresidente;

	@Schema(description = "Correo electrónico de contacto", example = "contacto@partidomas.bo", required = true)
	@NotBlank(message = "El correo electrónico es obligatorio")
	@Email(message = "El correo debe ser un email válido")
	private String correoElectronico;

	@Schema(description = "Descripción de la propuesta electoral", example = "Propuesta enfocada en estabilidad económica y social", required = false)
	@Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
	private String descripcion;
}
