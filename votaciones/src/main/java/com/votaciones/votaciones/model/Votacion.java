package com.votaciones.votaciones.model;

import java.time.Instant;

/**
 * Modelo de Votación con campos: id, partido, candidato, localidad, fecha
 */
public class Votacion {

	private Long id;
	private String partido;
	private String candidato;
	private String localidad;
	private Instant fecha;
	private Instant creadoEn;
	private Instant actualizadoEn;

	public Votacion() {
	}

	public Votacion(String partido, String candidato, String localidad, Instant fecha) {
		this.partido = partido;
		this.candidato = candidato;
		this.localidad = localidad;
		this.fecha = fecha;
	}

	public void prePersist() {
		Instant now = Instant.now();
		this.creadoEn = now;
		this.actualizadoEn = now;
	}

	public void preUpdate() {
		this.actualizadoEn = Instant.now();
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


