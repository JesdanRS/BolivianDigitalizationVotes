package com.votaciones.resultados_estadisticas.model;

import java.time.Instant;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ResultadoMesa", description = "Resultado por mesa con desglose por canal")
public class ResultadoMesa {

	@Schema(example = "1")
	private Long id;
	@Schema(example = "La Paz")
	private String departamento;
	@Schema(example = "La Paz")
	private String municipio;
	@Schema(example = "Colegio Bolívar")
	private String recinto;
	@Schema(example = "Mesa 1")
	private String mesa;
	@Schema(example = "300")
	private long inscritos;

	// Desglose por canal
	@Schema(description = "Votos válidos canal presencial", example = "200")
	private long votosValidosPresencial;
	@Schema(description = "Votos nulos canal presencial", example = "10")
	private long votosNulosPresencial;
	@Schema(description = "Votos blancos canal presencial", example = "5")
	private long votosBlancosPresencial;

	@Schema(description = "Votos válidos canal web", example = "0")
	private long votosValidosWeb;
	@Schema(description = "Votos nulos canal web", example = "0")
	private long votosNulosWeb;
	@Schema(description = "Votos blancos canal web", example = "0")
	private long votosBlancosWeb;
	@Schema(description = "Fecha de registro", example = "2025-09-11T13:00:00Z")
	private Instant registradoEn;
	@Schema(description = "Fecha de última actualización", example = "2025-09-11T13:10:00Z")
	private Instant actualizadoEn;

	public ResultadoMesa() {}

	public ResultadoMesa(String departamento, String municipio, String recinto, String mesa, int inscritos,
			int votosValidos, int votosNulos, int votosBlancos) {
		this.departamento = departamento;
		this.municipio = municipio;
		this.recinto = recinto;
		this.mesa = mesa;
		this.inscritos = inscritos;
		// Mapear a canal presencial para compatibilidad con tests existentes
		this.votosValidosPresencial = votosValidos;
		this.votosNulosPresencial = votosNulos;
		this.votosBlancosPresencial = votosBlancos;
		// Inicializar canal web en 0 por defecto
		this.votosValidosWeb = 0L;
		this.votosNulosWeb = 0L;
		this.votosBlancosWeb = 0L;
	}

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


