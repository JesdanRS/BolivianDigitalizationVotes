package com.votaciones.votaciones.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

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

	public VotacionCreacionDto() {
	}

	public VotacionCreacionDto(String partido, String candidato, String localidad, Instant fecha) {
		this.partido = partido;
		this.candidato = candidato;
		this.localidad = localidad;
		this.fecha = fecha;
	}

	public String getPartido() {
		return partido;
	}

	public void setPartido(String partido) {
		this.partido = partido;
	}

	public String getCandidato() {
		return candidato;
	}

	public void setCandidato(String candidato) {
		this.candidato = candidato;
	}

	public String getLocalidad() {
		return localidad;
	}

	public void setLocalidad(String localidad) {
		this.localidad = localidad;
	}

	public Instant getFecha() {
		return fecha;
	}

	public void setFecha(Instant fecha) {
		this.fecha = fecha;
	}
}


