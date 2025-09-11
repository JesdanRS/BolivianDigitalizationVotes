package com.votaciones.auditoria_registros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class AuditoriaRegistrosDto {

    @NotBlank(message = "El tipo de evento es obligatorio")
    private String tipoEvento;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(min = 5, max = 255, message = "La descripción debe tener entre 5 y 255 caracteres")
    private String descripcion;

    @Pattern(regexp = "\\d{7,8}", message = "El usuario debe ser una cédula de identidad válida (7 a 8 dígitos)")
    @NotBlank(message = "El usuario es obligatorio")
    private String usuario;

    public String getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(String tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
}
