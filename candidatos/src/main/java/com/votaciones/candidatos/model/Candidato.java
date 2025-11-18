package com.votaciones.candidatos.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Modelo de Candidato para el sistema de digitalización de votaciones bolivianas
 * Representa una fórmula de candidatos (Presidente + Vicepresidente) de un partido político
 */
@Entity
@Table(name = "candidatos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidato {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 50)
	private String partido;

	@Column(nullable = false, length = 100)
	private String nombreCompletoPresidente;

	@Column(nullable = false, length = 100)
	private String nombreCompletoVicepresidente;

	@Column(length = 500)
	private String descripcion;

	@Column(nullable = false, unique = true, length = 20)
	private String carnetPresidente;

	@Column(nullable = false, unique = true, length = 20)
	private String carnetVicepresidente;

	@Column(nullable = false)
	private LocalDate fechaNacimientoPresidente;

	@Column(nullable = false)
	private LocalDate fechaNacimientoVicepresidente;

	@Column(unique = true, length = 150)
	private String correoElectronico;

	@Column(nullable = false)
	private boolean correoVerificado = false;

	@Column(length = 6)
	private String codigoVerificacion;

	private Instant codigoExpiracion;

	@CreationTimestamp
	private Instant creadoEn;

	@UpdateTimestamp
	private Instant actualizadoEn;

	/**
	 * Constructor auxiliar para crear un candidato con información básica
	 */
	public Candidato(String partido, String nombreCompletoPresidente, String nombreCompletoVicepresidente, 
	                 String carnetPresidente, String carnetVicepresidente,
	                 LocalDate fechaNacimientoPresidente, LocalDate fechaNacimientoVicepresidente,
	                 String descripcion, String correoElectronico) {
		this.partido = partido;
		this.nombreCompletoPresidente = nombreCompletoPresidente;
		this.nombreCompletoVicepresidente = nombreCompletoVicepresidente;
		this.carnetPresidente = carnetPresidente;
		this.carnetVicepresidente = carnetVicepresidente;
		this.fechaNacimientoPresidente = fechaNacimientoPresidente;
		this.fechaNacimientoVicepresidente = fechaNacimientoVicepresidente;
		this.descripcion = descripcion;
		this.correoElectronico = correoElectronico;
	}
}


