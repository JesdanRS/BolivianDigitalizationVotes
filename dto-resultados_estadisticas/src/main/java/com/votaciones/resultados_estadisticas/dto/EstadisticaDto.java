// Ubicación: dto-resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/dto/EstadisticaDto.java
package com.votaciones.resultados_estadisticas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(name = "Estadistica", description = "Resumen estadístico agregado por departamento o nivel nacional")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticaDto {
    
    @Schema(description = "Departamento o nivel de agregación", example = "La Paz")
    private String departamento;
    
    @Schema(description = "Total de votantes inscritos", example = "300")
    private long totalVotantes;
    
    @Schema(description = "Total de votos válidos (presencial + web)", example = "200")
    private long votosValidos;
    
    @Schema(description = "Total de votos nulos (presencial + web)", example = "10")
    private long votosNulos;
    
    @Schema(description = "Total de votos blancos (presencial + web)", example = "5")
    private long votosBlancos;
    
    @Schema(description = "Porcentaje de participación electoral", example = "71.67")
    private double participacionPorcentaje;
    
    // Desglose por canal (opcionales)
    @Schema(description = "Votos válidos del canal presencial", example = "200")
    private long votosValidosPresencial;
    
    @Schema(description = "Votos nulos del canal presencial", example = "10")
    private long votosNulosPresencial;
    
    @Schema(description = "Votos blancos del canal presencial", example = "5")
    private long votosBlancosPresencial;
    
    @Schema(description = "Votos válidos del canal web", example = "0")
    private long votosValidosWeb;
    
    @Schema(description = "Votos nulos del canal web", example = "0")
    private long votosNulosWeb;
    
    @Schema(description = "Votos blancos del canal web", example = "0")
    private long votosBlancosWeb;
    
    // Constructor simplificado para estadísticas básicas
    public EstadisticaDto(String departamento, long totalVotantes, long votosValidos, 
                         long votosNulos, long votosBlancos, double participacionPorcentaje) {
        this.departamento = departamento;
        this.totalVotantes = totalVotantes;
        this.votosValidos = votosValidos;
        this.votosNulos = votosNulos;
        this.votosBlancos = votosBlancos;
        this.participacionPorcentaje = participacionPorcentaje;
    }
}
