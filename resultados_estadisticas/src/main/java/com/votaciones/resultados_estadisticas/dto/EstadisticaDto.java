package com.votaciones.resultados_estadisticas.dto;

public class EstadisticaDto {

	private String departamento;
	private long totalVotantes;
	private long votosValidos;
	private long votosNulos;
	private long votosBlancos;
	private double participacionPorcentaje;

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
}


