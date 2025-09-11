package com.votaciones.resultados_estadisticas.model;

import java.time.Instant;

public class ResultadoMesa {

	private Long id;
	private String departamento;
	private String municipio;
	private String recinto;
	private String mesa;
	private long inscritos;
	private long votosValidos;
	private long votosNulos;
	private long votosBlancos;
	private Instant registradoEn;
	private Instant actualizadoEn;

	public ResultadoMesa() {}

	public ResultadoMesa(String departamento, String municipio, String recinto, String mesa, long inscritos, long votosValidos, long votosNulos, long votosBlancos) {
		this.departamento = departamento;
		this.municipio = municipio;
		this.recinto = recinto;
		this.mesa = mesa;
		this.inscritos = inscritos;
		this.votosValidos = votosValidos;
		this.votosNulos = votosNulos;
		this.votosBlancos = votosBlancos;
	}

	public void prePersist() {
		Instant now = Instant.now();
		this.registradoEn = now;
		this.actualizadoEn = now;
	}

	public void preUpdate() {
		this.actualizadoEn = Instant.now();
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getDepartamento() { return departamento; }
	public void setDepartamento(String departamento) { this.departamento = departamento; }
	public String getMunicipio() { return municipio; }
	public void setMunicipio(String municipio) { this.municipio = municipio; }
	public String getRecinto() { return recinto; }
	public void setRecinto(String recinto) { this.recinto = recinto; }
	public String getMesa() { return mesa; }
	public void setMesa(String mesa) { this.mesa = mesa; }
	public long getInscritos() { return inscritos; }
	public void setInscritos(long inscritos) { this.inscritos = inscritos; }
	public long getVotosValidos() { return votosValidos; }
	public void setVotosValidos(long votosValidos) { this.votosValidos = votosValidos; }
	public long getVotosNulos() { return votosNulos; }
	public void setVotosNulos(long votosNulos) { this.votosNulos = votosNulos; }
	public long getVotosBlancos() { return votosBlancos; }
	public void setVotosBlancos(long votosBlancos) { this.votosBlancos = votosBlancos; }
	public Instant getRegistradoEn() { return registradoEn; }
	public void setRegistradoEn(Instant registradoEn) { this.registradoEn = registradoEn; }
	public Instant getActualizadoEn() { return actualizadoEn; }
	public void setActualizadoEn(Instant actualizadoEn) { this.actualizadoEn = actualizadoEn; }
}


