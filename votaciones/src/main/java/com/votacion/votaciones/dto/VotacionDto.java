package com.votacion.votaciones.dto;

import com.votacion.votaciones.model.Votacion;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

/**
 * DTO para la respuesta de votaciones en el sistema de votaciones bolivianas
 */
@Schema(name = "Votacion", description = "Información de una votación")
public class VotacionDto {

    @Schema(description = "ID único de la votación", example = "1")
    private Long id;

    @Schema(description = "Carnet del votante", example = "12345678")
    private String carnetVotante;

    @Schema(description = "Nombre completo del votante", example = "Juan Carlos Pérez Mamani")
    private String nombreCompletoVotante;

    @Schema(description = "Mesa de votación", example = "Mesa 123")
    private String mesaVotacion;

    @Schema(description = "Recinto electoral", example = "Unidad Educativa Simón Bolívar")
    private String recinto;

    @Schema(description = "Departamento", example = "La Paz")
    private String departamento;

    @Schema(description = "Municipio", example = "La Paz")
    private String municipio;

    @Schema(description = "Candidato seleccionado", example = "Juan Pérez")
    private String candidatoSeleccionado;

    @Schema(description = "Partido político", example = "Partido Democrático")
    private String partidoPolitico;

    @Schema(description = "Indica si la votación ha sido verificada", example = "true")
    private boolean votacionVerificada;

    @Schema(description = "Fecha y hora de la votación", example = "2024-01-15T10:30:00Z")
    private Instant fechaHoraVotacion;

    @Schema(description = "Fecha de creación", example = "2024-01-15T10:30:00Z")
    private Instant creadoEn;

    @Schema(description = "Fecha de última actualización", example = "2024-01-15T10:30:00Z")
    private Instant actualizadoEn;

    public VotacionDto() {
    }

    public VotacionDto(Long id, String carnetVotante, String nombreCompletoVotante, String mesaVotacion,
                      String recinto, String departamento, String municipio, String candidatoSeleccionado,
                      String partidoPolitico, boolean votacionVerificada, Instant fechaHoraVotacion,
                      Instant creadoEn, Instant actualizadoEn) {
        this.id = id;
        this.carnetVotante = carnetVotante;
        this.nombreCompletoVotante = nombreCompletoVotante;
        this.mesaVotacion = mesaVotacion;
        this.recinto = recinto;
        this.departamento = departamento;
        this.municipio = municipio;
        this.candidatoSeleccionado = candidatoSeleccionado;
        this.partidoPolitico = partidoPolitico;
        this.votacionVerificada = votacionVerificada;
        this.fechaHoraVotacion = fechaHoraVotacion;
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;
    }

    /**
     * Convierte una entidad Votacion a un DTO
     */
    public static VotacionDto fromEntity(Votacion votacion) {
        return new VotacionDto(
            votacion.getId(),
            votacion.getCarnetVotante(),
            votacion.getNombreCompletoVotante(),
            votacion.getMesaVotacion(),
            votacion.getRecinto(),
            votacion.getDepartamento(),
            votacion.getMunicipio(),
            votacion.getCandidatoSeleccionado(),
            votacion.getPartidoPolitico(),
            votacion.isVotacionVerificada(),
            votacion.getFechaHoraVotacion(),
            votacion.getCreadoEn(),
            votacion.getActualizadoEn()
        );
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public boolean isVotacionVerificada() {
        return votacionVerificada;
    }

    public void setVotacionVerificada(boolean votacionVerificada) {
        this.votacionVerificada = votacionVerificada;
    }

    public Instant getFechaHoraVotacion() {
        return fechaHoraVotacion;
    }

    public void setFechaHoraVotacion(Instant fechaHoraVotacion) {
        this.fechaHoraVotacion = fechaHoraVotacion;
    }

    public Instant getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(Instant creadoEn) {
        this.creadoEn = creadoEn;
    }

    public Instant getActualizadoEn() {
        return actualizadoEn;
    }

    public void setActualizadoEn(Instant actualizadoEn) {
        this.actualizadoEn = actualizadoEn;
    }
}