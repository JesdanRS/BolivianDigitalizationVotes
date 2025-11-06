package com.votaciones.resultados_estadisticas.repository.custom;

import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import java.util.List;

/**
 * Interfaz para consultas personalizadas usando Criteria API
 */
public interface ResultadoMesaRepositoryCustom {
    
    /**
     * Búsqueda avanzada con múltiples filtros opcionales usando Criteria Query
     * 
     * @param departamento Filtro por departamento (opcional)
     * @param municipio Filtro por municipio (opcional)
     * @param recinto Filtro por recinto (opcional)
     * @param votosMinimos Votos válidos mínimos totales (opcional)
     * @return Lista de resultados que cumplen los criterios
     */
    List<ResultadoMesa> buscarConFiltros(
        String departamento,
        String municipio,
        String recinto,
        Long votosMinimos
    );
}
