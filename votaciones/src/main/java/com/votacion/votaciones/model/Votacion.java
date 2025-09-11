package com.votacion.votaciones.model;

import java.time.Instant;

/**
 * Modelo de Votación para el sistema de digitalización de votaciones bolivianas
 */
public class Votacion {

    private Long id;
    private String carnetVotante;
    private String nombreCompletoVotante;
    private String mesaVotacion;
    private String recinto;
    private String departamento;
    private String municipio;
    private String candidatoSeleccionado;
    private String partidoPolitico;
    private boolean votacionVerificada;
    private Instant fechaHoraVotacion;
    private Instant creadoEn;
    private Instant actualizadoEn;

    public Votacion() {
    }

    public Votacion(String carnetVotante, String nombreCompletoVotante, String mesaVotacion, 
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
        this.votacionVerificada = false;
        this.fechaHoraVotacion = Instant.now();
    }

    public void prePersist() {
        Instant now = Instant.now();
        this.creadoEn = now;
        this.actualizadoEn = now;
    }

    public void preUpdate() {
        this.actualizadoEn = Instant.now();
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