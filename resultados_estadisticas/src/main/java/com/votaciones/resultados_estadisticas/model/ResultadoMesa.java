package com.votaciones.resultados_estadisticas.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "resultados_mesa")
@Data
public class ResultadoMesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String departamento;

    @Column(nullable = false, length = 100)
    private String municipio;

    @Column(nullable = false, length = 200)
    private String recinto;

    @Column(nullable = false, length = 50)
    private String mesa;

    @Column(nullable = false)
    private long inscritos;

    // Desglose por canal presencial
    @Column(nullable = false)
    private long votosValidosPresencial;

    @Column(nullable = false)
    private long votosNulosPresencial;

    @Column(nullable = false)
    private long votosBlancosPresencial;

    // Desglose por canal web
    @Column(nullable = false)
    private long votosValidosWeb = 0L;

    @Column(nullable = false)
    private long votosNulosWeb = 0L;

    @Column(nullable = false)
    private long votosBlancosWeb = 0L;

    @Column(nullable = false, updatable = false)
    private Instant registradoEn;

    @Column(nullable = false)
    private Instant actualizadoEn;

    // Constructor para compatibilidad con tests existentes
    public ResultadoMesa(String departamento, String municipio, String recinto, String mesa, int inscritos,
                        int votosValidos, int votosNulos, int votosBlancos) {
        this.departamento = departamento;
        this.municipio = municipio;
        this.recinto = recinto;
        this.mesa = mesa;
        this.inscritos = inscritos;
        this.votosValidosPresencial = votosValidos;
        this.votosNulosPresencial = votosNulos;
        this.votosBlancosPresencial = votosBlancos;
        this.votosValidosWeb = 0L;
        this.votosNulosWeb = 0L;
        this.votosBlancosWeb = 0L;
    }

    @PrePersist
    protected void prePersist() {
        Instant now = Instant.now();
        this.registradoEn = now;
        this.actualizadoEn = now;
    }

    @PreUpdate
    protected void preUpdate() {
        this.actualizadoEn = Instant.now();
    }

    // Métodos calculados (no persistidos)
    @Transient
    public long getVotosValidos() {
        return votosValidosPresencial + votosValidosWeb;
    }

    @Transient
    public long getVotosNulos() {
        return votosNulosPresencial + votosNulosWeb;
    }

    @Transient
    public long getVotosBlancos() {
        return votosBlancosPresencial + votosBlancosWeb;
    }
}


