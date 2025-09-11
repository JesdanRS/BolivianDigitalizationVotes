package com.votaciones.auditoria_registros.model;

import java.time.LocalDateTime;

public class AuditoriaRegistro {
    private Long id;
    private String tipoEvento; // puede ser login, voto_emitido, error y otros (Está por verse los eventos a registrar)
    private String descripcion;
    private String usuario; // el ci del que realizó el evento
    private LocalDateTime fechaHora;

    public AuditoriaRegistro(Long id, String tipoEvento, String descripcion, String usuario, LocalDateTime fechaHora) {
        this.id = id;
        this.tipoEvento = tipoEvento;
        this.descripcion = descripcion;
        this.usuario = usuario;
        this.fechaHora = fechaHora;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    
}
