package com.votaciones.auditoria_registros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Datos para crear un registro de auditoría")
public class AuditoriaCreacionDto {

    @NotBlank(message = "El tipo de evento es obligatorio")
    @Schema(description = "Tipo de evento registrado", example = "LOGIN, ERROR, VOTO, ...")
    private String tipo;

    @NotBlank(message = "La severidad es obligatoria")
    @Schema(description = "Nivel de severidad del evento", example = "INFO, WARN, ERROR, CRITICAL, ...")
    private String severidad;

    @NotBlank(message = "El módulo es obligatorio")
    @Schema(description = "Nombre del módulo origen", example = "Usuarios, Votaciones, Resultados")
    private String modulo;

    @Pattern(regexp = "\\d{7,8}", message = "El usuario debe ser una cédula válida (7-8 dígitos)")
    @NotBlank(message = "El usuario es obligatorio")
    @Schema(description = "Cédula del usuario", example = "12345678")
    private String usuario;

    @NotBlank(message = "La IP es obligatoria")
    @Schema(description = "Dirección IP del origen", example = "192.168.1.15")
    private String ip;

    @NotBlank(message = "El ID de correlación es obligatorio")
    @Schema(description = "Identificador de correlación del evento", example = "REQ-2025-001")
    private String correlacion;

    @NotBlank(message = "El detalle no puede estar vacío")
    @Size(min = 5, max = 500, message = "El detalle debe tener entre 5 y 500 caracteres")
    @Schema(description = "Descripción detallada del evento", example = "El usuario 12345678 inició sesión exitosamente")
    private String detalle;

    // Getters y setters
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getSeveridad() { return severidad; }
    public void setSeveridad(String severidad) { this.severidad = severidad; }

    public String getModulo() { return modulo; }
    public void setModulo(String modulo) { this.modulo = modulo; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getCorrelacion() { return correlacion; }
    public void setCorrelacion(String correlacion) { this.correlacion = correlacion; }

    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
}