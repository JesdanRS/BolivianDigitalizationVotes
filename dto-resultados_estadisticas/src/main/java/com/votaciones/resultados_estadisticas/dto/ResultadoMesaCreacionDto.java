// Ubicación: dto-resultados_estadisticas/src/main/java/com/votaciones/resultados_estadisticas/dto/ResultadoMesaCreacionDto.java
package com.votaciones.resultados_estadisticas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Schema(name = "ResultadoMesaCreacion", description = "Datos para crear o registrar un resultado de mesa electoral")
@Data
public class ResultadoMesaCreacionDto {
    
    @NotBlank(message = "El departamento es obligatorio")
    @Schema(description = "Departamento electoral", example = "La Paz", requiredMode = Schema.RequiredMode.REQUIRED)
    private String departamento;
    
    @NotBlank(message = "El municipio es obligatorio")
    @Schema(description = "Municipio electoral", example = "La Paz", requiredMode = Schema.RequiredMode.REQUIRED)
    private String municipio;
    
    @NotBlank(message = "El recinto es obligatorio")
    @Schema(description = "Nombre del recinto electoral", example = "Colegio Bolívar", requiredMode = Schema.RequiredMode.REQUIRED)
    private String recinto;
    
    @NotBlank(message = "La mesa es obligatoria")
    @Schema(description = "Identificador de la mesa", example = "Mesa 1", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mesa;
    
    @NotNull(message = "El número de inscritos es obligatorio")
    @Min(value = 0, message = "El número de inscritos no puede ser negativo")
    @Schema(description = "Total de votantes inscritos en la mesa", example = "300", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long inscritos;
    
    // Votos presenciales
    @NotNull(message = "Los votos válidos presenciales son obligatorios")
    @Min(value = 0, message = "Los votos válidos presenciales no pueden ser negativos")
    @Schema(description = "Votos válidos registrados de forma presencial", example = "200", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long votosValidosPresencial;
    
    @NotNull(message = "Los votos nulos presenciales son obligatorios")
    @Min(value = 0, message = "Los votos nulos presenciales no pueden ser negativos")
    @Schema(description = "Votos nulos registrados de forma presencial", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long votosNulosPresencial;
    
    @NotNull(message = "Los votos blancos presenciales son obligatorios")
    @Min(value = 0, message = "Los votos blancos presenciales no pueden ser negativos")
    @Schema(description = "Votos blancos registrados de forma presencial", example = "5", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long votosBlancosPresencial;
    
    // Votos web (opcionales, por defecto 0)
    @Min(value = 0, message = "Los votos válidos web no pueden ser negativos")
    @Schema(description = "Votos válidos registrados vía web", example = "0", defaultValue = "0")
    private Long votosValidosWeb = 0L;
    
    @Min(value = 0, message = "Los votos nulos web no pueden ser negativos")
    @Schema(description = "Votos nulos registrados vía web", example = "0", defaultValue = "0")
    private Long votosNulosWeb = 0L;
    
    @Min(value = 0, message = "Los votos blancos web no pueden ser negativos")
    @Schema(description = "Votos blancos registrados vía web", example = "0", defaultValue = "0")
    private Long votosBlancosWeb = 0L;
}
