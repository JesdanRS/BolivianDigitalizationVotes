package com.votaciones.candidatos.model;

import java.time.Instant;

/**
 * Modelo de Candidato para el sistema de digitalización de votaciones bolivianas
 */
public class Candidato {

	private Long idCandidato;
	private String partido;
	private String nombreCompletoPresidente;
	private String nombreCompletoVicepresidente;
	private String descripcion;
	private Instant creadoEn;
	private Instant actualizadoEn;

	public Candidato() {
	}

	public Candidato(String partido, String nombreCompletoPresidente, String nombreCompletoVicepresidente, String descripcion) {
		this.partido = partido;
		this.nombreCompletoPresidente = nombreCompletoPresidente;
		this.nombreCompletoVicepresidente = nombreCompletoVicepresidente;
		this.descripcion = descripcion;
	}

	public void prePersist() {
		Instant now = Instant.now();
		this.creadoEn = now;
		this.actualizadoEn = now;
	}

	public void preUpdate() {
		this.actualizadoEn = Instant.now();
	}

	public Long getIdCandidato() {
		return idCandidato;
	}

	public void setIdCandidato(Long idCandidato) {
		this.idCandidato = idCandidato;
	}

	public String getPartido() {
		return partido;
	}

	public void setPartido(String partido) {
		this.partido = partido;
	}

	public String getNombreCompletoPresidente() {
		return nombreCompletoPresidente;
	}

	public void setNombreCompletoPresidente(String nombreCompletoPresidente) {
		this.nombreCompletoPresidente = nombreCompletoPresidente;
	}

	public String getNombreCompletoVicepresidente() {
		return nombreCompletoVicepresidente;
	}

	public void setNombreCompletoVicepresidente(String nombreCompletoVicepresidente) {
		this.nombreCompletoVicepresidente = nombreCompletoVicepresidente;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
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


