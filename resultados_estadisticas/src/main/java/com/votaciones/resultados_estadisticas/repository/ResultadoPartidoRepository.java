package com.votaciones.resultados_estadisticas.repository;

import com.votaciones.resultados_estadisticas.model.ResultadoPartido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ResultadoPartidoRepository extends JpaRepository<ResultadoPartido, Long> {

    /**
     * Buscar resultado por partido
     */
    Optional<ResultadoPartido> findByPartido(String partido);

    /**
     * Verificar si existe un resultado para un partido
     */
    boolean existsByPartido(String partido);

    /**
     * Obtener todos los resultados ordenados por conteo de votos (descendente)
     */
    @Query("SELECT r FROM ResultadoPartido r ORDER BY r.conteoVotos DESC")
    List<ResultadoPartido> findAllOrderByConteoVotosDesc();

    /**
     * Incrementar el conteo de votos de un partido de forma atómica
     */
    @Modifying
    @Query("UPDATE ResultadoPartido r SET r.conteoVotos = r.conteoVotos + 1, r.actualizadoEn = CURRENT_TIMESTAMP WHERE r.partido = :partido")
    int incrementarVoto(@Param("partido") String partido);
}
