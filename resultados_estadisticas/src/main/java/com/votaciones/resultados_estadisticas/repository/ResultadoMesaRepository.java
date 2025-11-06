package com.votaciones.resultados_estadisticas.repository;

import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultadoMesaRepository extends JpaRepository<ResultadoMesa, Long> {

    // Buscar resultados por departamento
    List<ResultadoMesa> findByDepartamento(String departamento);

    // Buscar resultados por municipio
    List<ResultadoMesa> findByMunicipio(String municipio);

    // Buscar resultados por departamento y municipio
    List<ResultadoMesa> findByDepartamentoAndMunicipio(String departamento, String municipio);

    // Buscar resultados por recinto
    List<ResultadoMesa> findByRecinto(String recinto);

    // Query personalizada para estadísticas por departamento
    @Query("SELECT r FROM ResultadoMesa r WHERE r.departamento = :departamento ORDER BY r.mesa")
    List<ResultadoMesa> findByDepartamentoOrdenado(@Param("departamento") String departamento);

    // Verificar si existe un resultado para una mesa específica
    boolean existsByDepartamentoAndMunicipioAndRecintoAndMesa(
            String departamento, String municipio, String recinto, String mesa);
}
