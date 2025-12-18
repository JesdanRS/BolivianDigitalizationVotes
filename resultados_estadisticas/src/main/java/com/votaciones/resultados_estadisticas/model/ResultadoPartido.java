package com.votaciones.resultados_estadisticas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Entidad que almacena el conteo de votos por partido político.
 * Se actualiza en tiempo real mediante eventos Kafka.
 */
@Entity
@Table(name = "resultados_partido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoPartido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String partido;

    @Column(name = "conteo_votos", nullable = false)
    private Long conteoVotos = 0L;

    @Column(name = "actualizado_en", nullable = false)
    private Instant actualizadoEn;

    @PrePersist
    protected void prePersist() {
        if (actualizadoEn == null) {
            actualizadoEn = Instant.now();
        }
        if (conteoVotos == null) {
            conteoVotos = 0L;
        }
    }

    @PreUpdate
    protected void preUpdate() {
        actualizadoEn = Instant.now();
    }
}
