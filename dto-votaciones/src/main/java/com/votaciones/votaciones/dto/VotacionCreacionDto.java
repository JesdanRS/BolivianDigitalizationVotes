package com.votaciones.votaciones.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "VotacionCreacion", description = "Datos para crear un registro de votación")
public class VotacionCreacionDto {

	@Schema(description = "Partido político", example = "Movimiento al Socialismo", maxLength = 100, required = true)
	@NotBlank(message = "El partido es obligatorio")
	@Size(max = 100, message = "El partido no puede exceder 100 caracteres")
	private String partido;

	@Schema(description = "Nombre del candidato", example = "Juan Pérez", maxLength = 100, required = true)
	@NotBlank(message = "El candidato es obligatorio")
	@Size(max = 100, message = "El candidato no puede exceder 100 caracteres")
	private String candidato;

	@Schema(description = "Localidad de la votación", example = "La Paz", maxLength = 100, required = true)
	@NotBlank(message = "La localidad es obligatoria")
	@Size(max = 100, message = "La localidad no puede exceder 100 caracteres")
	private String localidad;

	@Schema(description = "Fecha del registro", example = "2025-09-10T10:30:00Z", required = true)
	@NotNull(message = "La fecha es obligatoria")
	private Instant fecha;

    @Schema(description = "Carnet del usuario que emite el voto", example = "1234567")
    private String carnetUsuario;

    @Schema(description = "Imagen del acta en Base64", example = "data:image/png;base64,iVBORw0KGgo...")
    private String actas;
}
