package com.votaciones.votaciones.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Entidad JPA de Votación con campos: id, partido, candidato, localidad, fecha
 */
@Entity
@Table(name = "votaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Votacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String partido;

	@Column(nullable = false, length = 100)
	private String candidato;

	@Column(nullable = false, length = 100)
	private String localidad;

	@Column(nullable = false)
	private Instant fecha;

	@Column(name = "creado_en", nullable = false, updatable = false)
	private Instant creadoEn;

	@Column(name = "actualizado_en", nullable = false)
	private Instant actualizadoEn;

	@PrePersist
	public void prePersist() {
		Instant now = Instant.now();
		this.creadoEn = now;
		this.actualizadoEn = now;
	}

	@PreUpdate
	public void preUpdate() {
		this.actualizadoEn = Instant.now();
	}
}


