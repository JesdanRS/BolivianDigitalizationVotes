package com.votaciones.resultados_estadisticas.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EstadisticaDto", description = "Resumen estadístico por departamento")
public class EstadisticaDto {

	@Schema(example = "La Paz")
	private String departamento;
	@Schema(example = "300")
	private long totalVotantes;
	@Schema(example = "200")
	private long votosValidos;
	@Schema(example = "10")
	private long votosNulos;
	@Schema(example = "5")
	private long votosBlancos;
	@Schema(example = "71.67")
	private double participacionPorcentaje;

	// Opcionales por canal (pueden quedar en cero si no se solicitan)
	@Schema(example = "200")
	private long votosValidosPresencial;
	@Schema(example = "10")
	private long votosNulosPresencial;
	@Schema(example = "5")
	private long votosBlancosPresencial;
	@Schema(example = "0")
	private long votosValidosWeb;
	@Schema(example = "0")
	private long votosNulosWeb;
	@Schema(example = "0")
	private long votosBlancosWeb;

	public EstadisticaDto() {}

	public EstadisticaDto(String departamento, long totalVotantes, long votosValidos, long votosNulos, long votosBlancos, double participacionPorcentaje) {
		this.departamento = departamento;
		this.totalVotantes = totalVotantes;
		this.votosValidos = votosValidos;
		this.votosNulos = votosNulos;
		this.votosBlancos = votosBlancos;
		this.participacionPorcentaje = participacionPorcentaje;
	}

	public String getDepartamento() {
		return departamento;
	}

	public void setDepartamento(String departamento) {
		this.departamento = departamento;
	}

	public long getTotalVotantes() {
		return totalVotantes;
	}

	public void setTotalVotantes(long totalVotantes) {
		this.totalVotantes = totalVotantes;
	}

	public long getVotosValidos() {
		return votosValidos;
	}

	public void setVotosValidos(long votosValidos) {
		this.votosValidos = votosValidos;
	}

	public long getVotosNulos() {
		return votosNulos;
	}

	public void setVotosNulos(long votosNulos) {
		this.votosNulos = votosNulos;
	}

	public long getVotosBlancos() {
		return votosBlancos;
	}

	public void setVotosBlancos(long votosBlancos) {
		this.votosBlancos = votosBlancos;
	}

	public double getParticipacionPorcentaje() {
		return participacionPorcentaje;
	}

	public void setParticipacionPorcentaje(double participacionPorcentaje) {
		this.participacionPorcentaje = participacionPorcentaje;
	}

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
}


