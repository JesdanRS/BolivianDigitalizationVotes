package com.votaciones.auditoria_registros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class AuditoriaRegistrosDto {

    @NotBlank(message = "El tipo de evento es obligatorio")
    @Schema(description = "Tipo de evento", example = "LOGIN, VOTO EMITIDO, ERROR")
    private String tipoEvento;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(min = 5, max = 255, message = "La descripción debe tener entre 5 y 255 caracteres")
    @Schema(description = "Descripción del evento", example = "Usuario X realizó una acción Y")
    private String descripcion;

    @Pattern(regexp = "\\d{7,8}", message = "El usuario debe ser una cédula de identidad válida (7 a 8 dígitos)")
    @NotBlank(message = "El usuario es obligatorio")
    @Schema(description = "Cédula de identidad del usuario que realizó el evento", example = "12345678")
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
