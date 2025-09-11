package com.votaciones.resultados_estadisticas.model;

import java.time.Instant;

public class ResultadoMesa {

	private Long id;
	private String departamento;
	private String municipio;
	private String recinto;
	private String mesa;
	private long inscritos;

	// Desglose por canal
	private long votosValidosPresencial;
	private long votosNulosPresencial;
	private long votosBlancosPresencial;

	private long votosValidosWeb;
	private long votosNulosWeb;
	private long votosBlancosWeb;
	private Instant registradoEn;
	private Instant actualizadoEn;

	public ResultadoMesa() {}

	public ResultadoMesa(String departamento, String municipio, String recinto, String mesa, long inscritos,
			long votosValidosPresencial, long votosNulosPresencial, long votosBlancosPresencial,
			long votosValidosWeb, long votosNulosWeb, long votosBlancosWeb) {
		this.departamento = departamento;
		this.municipio = municipio;
		this.recinto = recinto;
		this.mesa = mesa;
		this.inscritos = inscritos;
		this.votosValidosPresencial = votosValidosPresencial;
		this.votosNulosPresencial = votosNulosPresencial;
		this.votosBlancosPresencial = votosBlancosPresencial;
		this.votosValidosWeb = votosValidosWeb;
		this.votosNulosWeb = votosNulosWeb;
		this.votosBlancosWeb = votosBlancosWeb;
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
	// Totales calculados
	public long getVotosValidos() { return votosValidosPresencial + votosValidosWeb; }
	public long getVotosNulos() { return votosNulosPresencial + votosNulosWeb; }
	public long getVotosBlancos() { return votosBlancosPresencial + votosBlancosWeb; }

	// Desglose getters/setters
	public long getVotosValidosPresencial() { return votosValidosPresencial; }
	public void setVotosValidosPresencial(long votosValidosPresencial) { this.votosValidosPresencial = votosValidosPresencial; }
	public long getVotosNulosPresencial() { return votosNulosPresencial; }
	public void setVotosNulosPresencial(long votosNulosPresencial) { this.votosNulosPresencial = votosNulosPresencial; }
	public long getVotosBlancosPresencial() { return votosBlancosPresencial; }
	public void setVotosBlancosPresencial(long votosBlancosPresencial) { this.votosBlancosPresencial = votosBlancosPresencial; }
	public long getVotosValidosWeb() { return votosValidosWeb; }
	public void setVotosValidosWeb(long votosValidosWeb) { this.votosValidosWeb = votosValidosWeb; }
	public long getVotosNulosWeb() { return votosNulosWeb; }
	public void setVotosNulosWeb(long votosNulosWeb) { this.votosNulosWeb = votosNulosWeb; }
	public long getVotosBlancosWeb() { return votosBlancosWeb; }
	public void setVotosBlancosWeb(long votosBlancosWeb) { this.votosBlancosWeb = votosBlancosWeb; }
	public Instant getRegistradoEn() { return registradoEn; }
	public void setRegistradoEn(Instant registradoEn) { this.registradoEn = registradoEn; }
	public Instant getActualizadoEn() { return actualizadoEn; }
	public void setActualizadoEn(Instant actualizadoEn) { this.actualizadoEn = actualizadoEn; }
}


