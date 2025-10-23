package com.votaciones.auditoria_registros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Información de un registro de auditoría almacenado en el sistema")
public class AuditoriaDto {

    @Schema(description = "Identificador único del registro", example = "1")
    private Long id;

    @Schema(description = "Tipo de evento registrado", example = "LOGIN")
    private String tipoEvento;

    @Schema(description = "Descripción del evento", example = "Usuario 12345678 inició sesión correctamente.")
    private String descripcion;

    @Schema(description = "Cédula de identidad del usuario", example = "12345678")
    private String usuario;

    @Schema(description = "Fecha y hora del evento", example = "2025-10-22T15:30:00")
    private LocalDateTime fechaHora;

    // Constructor vacío
    public AuditoriaDto() {}

    public AuditoriaDto(Long id, String tipoEvento, String descripcion, String usuario, LocalDateTime fechaHora) {
        this.id = id;
        this.tipoEvento = tipoEvento;
        this.descripcion = descripcion;
        this.usuario = usuario;
        this.fechaHora = fechaHora;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTipoEvento() { return tipoEvento; }
    public void setTipoEvento(String tipoEvento) { this.tipoEvento = tipoEvento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
}
