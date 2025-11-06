// Ubicación: dto-resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/dto/FiltroResultadosDto.java
package com.votaciones.resultados_estadisticas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Schema(name = "FiltroResultados", description = "Criterios de filtrado para búsqueda de resultados electorales")
@Data
public class FiltroResultadosDto {
    
    @Schema(description = "Filtrar por departamento", example = "La Paz")
    private String departamento;
    
    @Schema(description = "Filtrar por municipio", example = "La Paz")
    private String municipio;
    
    @Schema(description = "Filtrar por recinto electoral", example = "Colegio Bolívar")
    private String recinto;
    
    @Min(value = 0, message = "El umbral de votos no puede ser negativo")
    @Schema(description = "Filtrar mesas con votos totales mayor o igual a este valor", example = "100")
    private Long votosMinimos;
    
    @Schema(description = "Ordenar resultados por campo", example = "departamento", 
            allowableValues = {"departamento", "municipio", "inscritos", "votosValidos"})
    private String ordenarPor;
    
    @Schema(description = "Dirección del ordenamiento", example = "ASC", 
            allowableValues = {"ASC", "DESC"})
    private String direccion = "ASC";
}
