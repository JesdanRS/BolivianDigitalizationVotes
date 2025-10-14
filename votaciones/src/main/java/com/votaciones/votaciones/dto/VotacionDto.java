package com.votaciones.votaciones.dto;

import com.votaciones.votaciones.model.Votacion;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

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

	public VotacionDto() {
	}

	public VotacionDto(Long id, String partido, String candidato, String localidad, Instant fecha, Instant creadoEn, Instant actualizadoEn) {
		this.id = id;
		this.partido = partido;
		this.candidato = candidato;
		this.localidad = localidad;
		this.fecha = fecha;
		this.creadoEn = creadoEn;
		this.actualizadoEn = actualizadoEn;
	}

	public static VotacionDto fromVotacion(Votacion v) {
		return new VotacionDto(
			v.getId(),
			v.getPartido(),
			v.getCandidato(),
			v.getLocalidad(),
			v.getFecha(),
			v.getCreadoEn(),
			v.getActualizadoEn()
		);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Instant getCreadoEn() {
		return creadoEn;
	}

	public void setCreadoEn(Instant creadoEn) {
		this.creadoEn = creadoEn;
	}

	public Instant getActualizadoEn() {
		return actualizadoEn;
	}

	public void setActualizadoEn(Instant actualizadoEn) {
		this.actualizadoEn = actualizadoEn;
	}
}


