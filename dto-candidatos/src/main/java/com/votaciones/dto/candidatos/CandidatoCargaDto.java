package com.votaciones.dto.candidatos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO para la carga masiva de candidatos
 */
@Schema(name = "CandidatoCargaDto", description = "Datos para cargar candidatos en lote")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatoCargaDto {

	@Schema(description = "Nombre del partido político", example = "MAS", required = true)
	@NotBlank(message = "El partido es obligatorio")
	private String partido;

	@Schema(description = "Nombre del presidente", example = "Luis Alberto Arce", required = true)
	@NotBlank(message = "El nombre del Presidente es obligatorio")
	private String nombreCompletoPresidente;

	@Schema(description = "Nombre del vicepresidente", example = "David Choquehuanca", required = true)
	@NotBlank(message = "El nombre del Vicepresidente es obligatorio")
	private String nombreCompletoVicepresidente;

	@Schema(description = "Carnet del presidente", example = "1234567", required = true)
	@NotBlank(message = "El carnet del Presidente es obligatorio")
	private String carnetPresidente;

	@Schema(description = "Carnet del vicepresidente", example = "7654321", required = true)
	@NotBlank(message = "El carnet del Vicepresidente es obligatorio")
	private String carnetVicepresidente;

	@Schema(description = "Fecha de nacimiento del presidente", example = "1965-09-28", required = true)
	@NotNull(message = "La fecha de nacimiento del Presidente es obligatoria")
	private LocalDate fechaNacimientoPresidente;

	@Schema(description = "Fecha de nacimiento del vicepresidente", example = "1964-06-15", required = true)
	@NotNull(message = "La fecha de nacimiento del Vicepresidente es obligatoria")
	private LocalDate fechaNacimientoVicepresidente;

	@Schema(description = "Correo electrónico", example = "contacto@partidomas.bo", required = false)
	@Email(message = "El correo debe ser válido")
	private String correoElectronico;

	@Schema(description = "Descripción", example = "Propuesta electoral", required = false)
	private String descripcion;
}
