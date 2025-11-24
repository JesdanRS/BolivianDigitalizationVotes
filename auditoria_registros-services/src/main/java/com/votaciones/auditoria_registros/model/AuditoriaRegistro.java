package com.votaciones.auditoria_registros.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
  name = "auditoria_registro",
  uniqueConstraints = @UniqueConstraint(name = "unique_auditoria_idx", columnNames = {"usuario", "tipo", "modulo", "fecha"})
)
public class AuditoriaRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false, length = 50)
    private String tipo; // LOGIN, VOTO EMITIDO, ERROR, ...

    @Column(nullable = false, length = 20)
    private String severidad; // INFO, WARN, ERROR, CRITICAL

    @Column(nullable = false, length = 100)
    private String modulo; // "Usuarios", "Votaciones", "Resultados", ...

    @Column(nullable = false, length = 20)
    private String usuario; // CI del usuario

    @Column(length = 50)
    private String ip; // IP origen

    @Column(length = 100)
    private String correlacion; // requestId / traceId

    @Column(nullable = false, length = 500)
    private String detalle;

    public AuditoriaRegistro() {}

    public AuditoriaRegistro(
            Long id,
            LocalDateTime fecha,
            String tipo,
            String severidad,
            String modulo,
            String usuario,
            String ip,
            String correlacion,
            String detalle
    ) {
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

    // Sin ID
    public AuditoriaRegistro(
            LocalDateTime fecha,
            String tipo,
            String severidad,
            String modulo,
            String usuario,
            String ip,
            String correlacion,
            String detalle
    ) {
        this.fecha = fecha;
        this.tipo = tipo;
        this.severidad = severidad;
        this.modulo = modulo;
        this.usuario = usuario;
        this.ip = ip;
        this.correlacion = correlacion;
        this.detalle = detalle;
    }

    // ===== Getters y Setters =====

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