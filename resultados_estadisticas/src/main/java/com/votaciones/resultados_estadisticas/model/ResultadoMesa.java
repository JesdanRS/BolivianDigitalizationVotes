package com.votaciones.resultados_estadisticas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Entidad JPA de ResultadoMesa - Almacena resultados de votación por mesa
 */
@Entity
@Table(name = "resultados_mesa")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoMesa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String departamento;

	@Column(nullable = false, length = 100)
	private String municipio;

	@Column(nullable = false, length = 150)
	private String recinto;

	@Column(nullable = false, length = 50)
	private String mesa;

	@Column(nullable = false)
	private Long numeroMesa;

	@Column(nullable = false)
	private Long inscritos;

	// Votos por canal presencial
	@Column(nullable = false)
	private Long votosValidosPresencial;

	@Column(nullable = false)
	private Long votosNulosPresencial;

	@Column(nullable = false)
	private Long votosBlancosPresencial;

	// Votos por canal web
	@Column(nullable = false)
	private Long votosValidosWeb;

	@Column(nullable = false)
	private Long votosNulosWeb;

	@Column(nullable = false)
	private Long votosBlancosWeb;

	@Column(name = "registrado_en", nullable = false, updatable = false)
	private Instant registradoEn;

	@Column(name = "actualizado_en", nullable = false)
	private Instant actualizadoEn;

	@PrePersist
	public void prePersist() {
		Instant now = Instant.now();
		this.registradoEn = now;
		this.actualizadoEn = now;
	}

	@PreUpdate
	public void preUpdate() {
		this.actualizadoEn = Instant.now();
	}
}


