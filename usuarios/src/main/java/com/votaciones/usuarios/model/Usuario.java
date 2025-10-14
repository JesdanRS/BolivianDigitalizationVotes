package com.votaciones.usuarios.model;

import java.time.Instant;

/**
 * Modelo de Usuario para el sistema de digitalización de votaciones bolivianas
 */
public class Usuario {

    private Long id;
    private String nombreCompleto;
    private String celular;
    private String direccion;
    private String departamento;
    private int edad;
    private String correoElectronico;
    private String carnet;
    private Instant creadoEn;
    private Instant actualizadoEn;

    public Usuario() {
    }

    public Usuario(String nombreCompleto, String celular, String direccion, 
                   String departamento, int edad, String correoElectronico, String carnet) {
        this.nombreCompleto = nombreCompleto;
        this.celular = celular;
        this.direccion = direccion;
        this.departamento = departamento;
        this.edad = edad;
        this.correoElectronico = correoElectronico;
        this.carnet = carnet;
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

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getCarnet() {
        return carnet;
    }

    public void setCarnet(String carnet) {
        this.carnet = carnet;
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