package com.votaciones.auditoria_registros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Información de un registro de auditoría almacenado")
public class AuditoriaDto {

    @Schema(description = "Identificador único", example = "1")
    private Long id;

    @Schema(description = "Fecha y hora del evento", example = "2025-10-22T15:30:00")
    private LocalDateTime fecha;

    @Schema(description = "Tipo de evento", example = "LOGIN")
    private String tipo;

    @Schema(description = "Nivel de severidad", example = "INFO")
    private String severidad;

    @Schema(description = "Módulo origen del evento", example = "Usuarios")
    private String modulo;

    @Schema(description = "Usuario asociado", example = "12345678")
    private String usuario;

    @Schema(description = "IP origen", example = "192.168.1.10")
    private String ip;

    @Schema(description = "ID de correlación", example = "REQ-2025-001")
    private String correlacion;

    @Schema(description = "Detalle o mensaje del evento", example = "El usuario inició sesión exitosamente.")
    private String detalle;

    // Constructor vacío
    public AuditoriaDto() {}

    // Constructor completo
    public AuditoriaDto(Long id, LocalDateTime fecha, String tipo, String severidad,
                        String modulo, String usuario, String ip, String correlacion, String detalle) {
        this.id = id;
        this.fecha = fecha;
        this.tipo = tipo;
        this.severidad = severidad;
        this.modulo = modulo;
        this.usuario = usuario;
        this.ip = ip;
        this.correlacion = correlacion;
        this.detalle = detalle;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

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