// Ubicación: dto-resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/dto/ResultadoMesaActualizacionDto.java
package com.votaciones.resultados_estadisticas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Schema(name = "ResultadoMesaActualizacion", description = "Datos para actualizar un resultado de mesa electoral existente")
@Data
public class ResultadoMesaActualizacionDto {
    
    @Schema(description = "Departamento electoral", example = "La Paz")
    private String departamento;
    
    @Schema(description = "Municipio electoral", example = "La Paz")
    private String municipio;
    
    @Schema(description = "Nombre del recinto electoral", example = "Colegio Bolívar")
    private String recinto;
    
    @Schema(description = "Identificador de la mesa", example = "Mesa 1")
    private String mesa;
    
    @Min(value = 0, message = "El número de inscritos no puede ser negativo")
    @Schema(description = "Total de votantes inscritos en la mesa", example = "300")
    private Long inscritos;
    
    // Votos presenciales
    @Min(value = 0, message = "Los votos válidos presenciales no pueden ser negativos")
    @Schema(description = "Votos válidos registrados de forma presencial", example = "200")
    private Long votosValidosPresencial;
    
    @Min(value = 0, message = "Los votos nulos presenciales no pueden ser negativos")
    @Schema(description = "Votos nulos registrados de forma presencial", example = "10")
    private Long votosNulosPresencial;
    
    @Min(value = 0, message = "Los votos blancos presenciales no pueden ser negativos")
    @Schema(description = "Votos blancos registrados de forma presencial", example = "5")
    private Long votosBlancosPresencial;
    
    // Votos web
    @Min(value = 0, message = "Los votos válidos web no pueden ser negativos")
    @Schema(description = "Votos válidos registrados vía web", example = "0")
    private Long votosValidosWeb;
    
    @Min(value = 0, message = "Los votos nulos web no pueden ser negativos")
    @Schema(description = "Votos nulos registrados vía web", example = "0")
    private Long votosNulosWeb;
    
    @Min(value = 0, message = "Los votos blancos web no pueden ser negativos")
    @Schema(description = "Votos blancos registrados vía web", example = "0")
    private Long votosBlancosWeb;
}
