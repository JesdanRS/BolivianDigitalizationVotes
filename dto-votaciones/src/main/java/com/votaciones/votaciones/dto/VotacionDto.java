package com.votaciones.votaciones.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Votacion", description = "Información de una votación")
public class VotacionDto {

	@Schema(description = "ID único", example = "1")
	private Long id;

	@Schema(description = "Partido político", example = "Movimiento al Socialismo")
	private String partido;

	@Schema(description = "Nombre del candidato", example = "Juan Pérez")
	private String candidato;

	@Schema(description = "Localidad del evento de votación", example = "La Paz")
	private String localidad;

	@Schema(description = "Fecha del registro", example = "2025-09-10T10:30:00Z")
	private Instant fecha;

	@Schema(description = "Fecha de creación", example = "2025-09-10T10:30:00Z")
	private Instant creadoEn;

	@Schema(description = "Fecha de última actualización", example = "2025-09-10T10:30:00Z")
	private Instant actualizadoEn;

    @Schema(description = "Imagen del acta en Base64", example = "data:image/png;base64,iVBORw0KGgo...")
    private String actas;
}
