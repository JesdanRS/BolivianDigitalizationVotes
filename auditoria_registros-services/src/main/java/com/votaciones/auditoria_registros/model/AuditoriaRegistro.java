package com.votaciones.auditoria_registros.model;

import java.time.LocalDateTime;

public class AuditoriaRegistro {

    private Long id;
    private LocalDateTime fecha;
    private String tipo;
    private String severidad;
    private String modulo;
    private String usuario;
    private String ip;
    private String correlacion;
    private String detalle;

    public AuditoriaRegistro() {}

    public AuditoriaRegistro(Long id,
                             LocalDateTime fecha,
                             String tipo,
                             String severidad,
                             String modulo,
                             String usuario,
                             String ip,
                             String correlacion,
                             String detalle) {
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

    // getters / setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public LocalDateTime getFecha() {return fecha;}
    public void setFecha(LocalDateTime fecha) {this.fecha = fecha;}

    public String getTipo() {return tipo;}
    public void setTipo(String tipo) {this.tipo = tipo;}

    public String getSeveridad() {return severidad;}
    public void setSeveridad(String severidad) {this.severidad = severidad;}

    public String getModulo() {return modulo;}
    public void setModulo(String modulo) {this.modulo = modulo;}

    public String getUsuario() {return usuario;}
    public void setUsuario(String usuario) {this.usuario = usuario;}

    public String getIp() {return ip;}
    public void setIp(String ip) {this.ip = ip;}

    public String getCorrelacion() {return correlacion;}
    public void setCorrelacion(String correlacion) {this.correlacion = correlacion;}

    public String getDetalle() {return detalle;}
    public void setDetalle(String detalle) {this.detalle = detalle;}
}