package com.votaciones.resultados_estadisticas.repository;

import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.repository.custom.ResultadoMesaRepositoryCustom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultadoMesaRepository extends JpaRepository<ResultadoMesa, Long>, ResultadoMesaRepositoryCustom {

    // ===== DERIVED QUERIES =====
    // Spring Data JPA genera automáticamente la implementación basándose en el nombre del método
    
    List<ResultadoMesa> findByDepartamentoIgnoreCase(String departamento);
    
    List<ResultadoMesa> findByMunicipioIgnoreCase(String municipio);
    
    List<ResultadoMesa> findByRecintoIgnoreCase(String recinto);
    
    List<ResultadoMesa> findByDepartamentoIgnoreCaseAndMunicipioIgnoreCase(String departamento, String municipio);

    // ===== NATIVE QUERY =====
    // Consulta SQL nativa para obtener resultados con votos totales mayores a un umbral
    
    @Query(value = "SELECT * FROM resultado_mesa WHERE " +
                   "(votos_validos_presencial + votos_validos_web + " +
                   "votos_nulos_presencial + votos_nulos_web + " +
                   "votos_blancos_presencial + votos_blancos_web) >= :umbral", 
           nativeQuery = true)
    List<ResultadoMesa> buscarPorVotosTotalesMayorIgualA(@Param("umbral") long umbral);
    
    @Query(value = "SELECT * FROM resultado_mesa WHERE departamento = :departamento " +
                   "AND (votos_validos_presencial + votos_validos_web) >= :votosValidos",
           nativeQuery = true)
    List<ResultadoMesa> buscarPorDepartamentoYVotosValidos(
        @Param("departamento") String departamento, 
        @Param("votosValidos") long votosValidos
    );
}
