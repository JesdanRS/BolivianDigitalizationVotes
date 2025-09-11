package com.votaciones.candidatos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO para la creación de candidatos en el sistema de votaciones bolivianas
 */
@Schema(name = "CandidatoCreacion", description = "Datos para crear un candidato nuevo")
public class CandidatoCreacionDto {

	@Schema(description = "Nombre del partido político", example = "Movimiento al Socialismo (MAS)", maxLength = 100, required = true)
	@NotBlank(message = "El partido es obligatorio")
	@Size(max = 100, message = "El partido no puede exceder 100 caracteres")
	private String partido;

	@Schema(description = "Nombre completo del candidato a presidente", example = "Luis Alberto Arce Catacora", maxLength = 100, required = true)
	@NotBlank(message = "El nombre completo del Presidente es obligatorio")
	@Size(max = 100, message = "El nombre del Presidente no puede exceder 100 caracteres")
	private String nombreCompletoPresidente;

	@Schema(description = "Nombre completo del candidato a vicepresidente", example = "David Choquehuanca Céspedes", maxLength = 100, required = true)
	@NotBlank(message = "El nombre completo del Vicepresidente es obligatorio")
	@Size(max = 100, message = "El nombre del Vicepresidente no puede exceder 100 caracteres")
	private String nombreCompletoVicepresidente;

	@Schema(description = "Descripción de la propuesta electoral", example = "Propuesta enfocada en estabilidad económica y social", maxLength = 500, required = false)
	@Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
	private String descripcion;

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
}


