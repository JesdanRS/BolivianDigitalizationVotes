package com.votaciones.resultados_estadisticas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Schema(name = "ResultadoPartido", description = "Resultado de votación por partido político")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoPartidoDto {

    @Schema(description = "Nombre del partido político", example = "Movimiento al Socialismo")
    private String partido;

    @Schema(description = "Conteo total de votos", example = "12345")
    private Long conteoVotos;

    @Schema(description = "Porcentaje de votos sobre el total", example = "45.67")
    private Double porcentaje;

    @Schema(description = "Fecha de última actualización", example = "2025-12-18T10:30:00Z")
    private Instant actualizadoEn;
}
