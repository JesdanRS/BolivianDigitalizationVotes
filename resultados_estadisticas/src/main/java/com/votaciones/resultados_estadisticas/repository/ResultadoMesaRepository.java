package com.votaciones.resultados_estadisticas.repository;

import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para ResultadoMesa con 3 tipos de consultas
 */
@Repository
public interface ResultadoMesaRepository extends JpaRepository<ResultadoMesa, Long> {

    // ========================================
    // 1. DERIVED QUERY (Spring Data genera automáticamente)
    // ========================================
    List<ResultadoMesa> findByDepartamentoIgnoreCase(String departamento);
    
    List<ResultadoMesa> findByMunicipioContainingIgnoreCase(String municipio);

    // ========================================
    // 2. JPQL QUERY (consulta con entidades)
    // ========================================
    @Query("SELECT r FROM ResultadoMesa r WHERE r.inscritos > :minInscritos ORDER BY r.inscritos DESC")
    List<ResultadoMesa> buscarPorMinimoInscritos(@Param("minInscritos") Long minInscritos);

    @Query("SELECT r.departamento, SUM(r.inscritos) FROM ResultadoMesa r GROUP BY r.departamento")
    List<Object[]> sumarInscritosPorDepartamento();

    // ========================================
    // 3. NATIVE QUERY (SQL directo)
    // ========================================
    @Query(value = "SELECT * FROM resultados_mesa WHERE votos_validos_presencial + votos_validos_web > :minVotos", 
           nativeQuery = true)
    List<ResultadoMesa> buscarPorVotosValidosMinimos(@Param("minVotos") Long minVotos);

    @Query(value = "SELECT departamento, COUNT(*) as total_mesas FROM resultados_mesa GROUP BY departamento ORDER BY total_mesas DESC", 
           nativeQuery = true)
    List<Object[]> contarMesasPorDepartamento();
}

