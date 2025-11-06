// Ubicación: dto-resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/dto/ResultadoMesaDto.java
package com.votaciones.resultados_estadisticas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.Instant;

@Schema(name = "ResultadoMesa", description = "Información completa de resultados por mesa electoral")
@Data
public class ResultadoMesaDto {
    
    @Schema(description = "ID único del resultado", example = "1")
    private Long id;
    
    @Schema(description = "Departamento electoral", example = "La Paz")
    private String departamento;
    
    @Schema(description = "Municipio electoral", example = "La Paz")
    private String municipio;
    
    @Schema(description = "Nombre del recinto electoral", example = "Colegio Bolívar")
    private String recinto;
    
    @Schema(description = "Identificador de la mesa", example = "Mesa 1")
    private String mesa;
    
    @Schema(description = "Total de votantes inscritos en la mesa", example = "300")
    private long inscritos;
    
    // Desglose por canal presencial
    @Schema(description = "Votos válidos registrados de forma presencial", example = "200")
    private long votosValidosPresencial;
    
    @Schema(description = "Votos nulos registrados de forma presencial", example = "10")
    private long votosNulosPresencial;
    
    @Schema(description = "Votos blancos registrados de forma presencial", example = "5")
    private long votosBlancosPresencial;
    
    // Desglose por canal web
    @Schema(description = "Votos válidos registrados vía web", example = "0")
    private long votosValidosWeb;
    
    @Schema(description = "Votos nulos registrados vía web", example = "0")
    private long votosNulosWeb;
    
    @Schema(description = "Votos blancos registrados vía web", example = "0")
    private long votosBlancosWeb;
    
    @Schema(description = "Fecha y hora de registro del resultado", example = "2025-01-05T10:30:00Z")
    private Instant registradoEn;
    
    @Schema(description = "Fecha y hora de última actualización", example = "2025-01-05T14:45:00Z")
    private Instant actualizadoEn;
}
