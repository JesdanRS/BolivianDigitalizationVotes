package com.votaciones.candidatos.dto;

import java.time.Instant;

import com.votaciones.candidatos.model.Candidato;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO para la respuesta de candidatos en el sistema de votaciones bolivianas
 */
@Schema(name = "Candidato", description = "Información de un candidato")
public class candidatosDto {

    @Schema(description = "ID único del candidato", example = "1")
    private Long idCandidato;

    @Schema(description = "Nombre del partido político", example = "Movimiento al Socialismo (MAS)")
    private String partido;

    @Schema(description = "Nombre completo del candidato a presidente", example = "Luis Alberto Arce Catacora")
    private String nombreCompletoPresidente;

    @Schema(description = "Nombre completo del candidato a vicepresidente", example = "David Choquehuanca Céspedes")
    private String nombreCompletoVicepresidente;

    @Schema(description = "Descripción de la propuesta electoral", example = "Propuesta enfocada en estabilidad económica y social")
    private String descripcion;

    @Schema(description = "Fecha de creación", example = "2024-01-15T10:30:00Z")
    private Instant creadoEn;

    @Schema(description = "Fecha de última actualización", example = "2024-01-15T10:30:00Z")
    private Instant actualizadoEn;

    public static candidatosDto fromCandidato(Candidato c) {
        candidatosDto dto = new candidatosDto();
        dto.setIdCandidato(c.getIdCandidato());
        dto.setPartido(c.getPartido());
        dto.setNombreCompletoPresidente(c.getNombreCompletoPresidente());
        dto.setNombreCompletoVicepresidente(c.getNombreCompletoVicepresidente());
        dto.setDescripcion(c.getDescripcion());
        dto.setCreadoEn(c.getCreadoEn());
        dto.setActualizadoEn(c.getActualizadoEn());
        return dto;
    }

    public Long getIdCandidato() {
        return idCandidato;
    }

    public void setIdCandidato(Long idCandidato) {
        this.idCandidato = idCandidato;
    }

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
