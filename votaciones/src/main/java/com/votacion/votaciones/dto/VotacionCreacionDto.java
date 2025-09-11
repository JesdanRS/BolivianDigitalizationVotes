package com.votacion.votaciones.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para la creación de votaciones en el sistema de votaciones bolivianas
 */
@Schema(name = "VotacionCreacion", description = "Datos para registrar una nueva votación")
public class VotacionCreacionDto {

    @Schema(description = "Carnet del votante", example = "12345678")
    @NotBlank(message = "El carnet del votante es obligatorio")
    @Size(max = 20, message = "El carnet no puede exceder 20 caracteres")
    private String carnetVotante;

    @Schema(description = "Nombre completo del votante", example = "Juan Carlos Pérez Mamani")
    @NotBlank(message = "El nombre completo del votante es obligatorio")
    @Size(max = 100, message = "El nombre completo no puede exceder 100 caracteres")
    private String nombreCompletoVotante;

    @Schema(description = "Mesa de votación", example = "Mesa 123")
    @NotBlank(message = "La mesa de votación es obligatoria")
    @Size(max = 50, message = "La mesa de votación no puede exceder 50 caracteres")
    private String mesaVotacion;

    @Schema(description = "Recinto electoral", example = "Unidad Educativa Simón Bolívar")
    @NotBlank(message = "El recinto es obligatorio")
    @Size(max = 150, message = "El recinto no puede exceder 150 caracteres")
    private String recinto;

    @Schema(description = "Departamento", example = "La Paz")
    @NotBlank(message = "El departamento es obligatorio")
    @Size(max = 50, message = "El departamento no puede exceder 50 caracteres")
    private String departamento;

    @Schema(description = "Municipio", example = "La Paz")
    @NotBlank(message = "El municipio es obligatorio")
    @Size(max = 50, message = "El municipio no puede exceder 50 caracteres")
    private String municipio;

    @Schema(description = "Candidato seleccionado", example = "Juan Pérez")
    @NotBlank(message = "El candidato seleccionado es obligatorio")
    @Size(max = 100, message = "El candidato seleccionado no puede exceder 100 caracteres")
    private String candidatoSeleccionado;

    @Schema(description = "Partido político", example = "Partido Democrático")
    @NotBlank(message = "El partido político es obligatorio")
    @Size(max = 100, message = "El partido político no puede exceder 100 caracteres")
    private String partidoPolitico;

    public VotacionCreacionDto() {
    }

    public VotacionCreacionDto(String carnetVotante, String nombreCompletoVotante, String mesaVotacion,
                             String recinto, String departamento, String municipio,
                             String candidatoSeleccionado, String partidoPolitico) {
        this.carnetVotante = carnetVotante;
        this.nombreCompletoVotante = nombreCompletoVotante;
        this.mesaVotacion = mesaVotacion;
        this.recinto = recinto;
        this.departamento = departamento;
        this.municipio = municipio;
        this.candidatoSeleccionado = candidatoSeleccionado;
        this.partidoPolitico = partidoPolitico;
    }

    // Getters y Setters
    public String getCarnetVotante() {
        return carnetVotante;
    }

    public void setCarnetVotante(String carnetVotante) {
        this.carnetVotante = carnetVotante;
    }

    public String getNombreCompletoVotante() {
        return nombreCompletoVotante;
    }

    public void setNombreCompletoVotante(String nombreCompletoVotante) {
        this.nombreCompletoVotante = nombreCompletoVotante;
    }

    public String getMesaVotacion() {
        return mesaVotacion;
    }

    public void setMesaVotacion(String mesaVotacion) {
        this.mesaVotacion = mesaVotacion;
    }

    public String getRecinto() {
        return recinto;
    }

    public void setRecinto(String recinto) {
        this.recinto = recinto;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getMunicipio() {
        return municipio;
    }

    public void setMunicipio(String municipio) {
        this.municipio = municipio;
    }

    public String getCandidatoSeleccionado() {
        return candidatoSeleccionado;
    }

    public void setCandidatoSeleccionado(String candidatoSeleccionado) {
        this.candidatoSeleccionado = candidatoSeleccionado;
    }

    public String getPartidoPolitico() {
        return partidoPolitico;
    }

    public void setPartidoPolitico(String partidoPolitico) {
        this.partidoPolitico = partidoPolitico;
    }
}