package com.votaciones.auditoria_registros.repository;

import com.votaciones.auditoria_registros.model.AuditoriaRegistro;
import com.votaciones.auditoria_registros.repository.custom.AuditoriaRegistroRepositoryCustom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRegistroRepository extends JpaRepository<AuditoriaRegistro, Long>, AuditoriaRegistroRepositoryCustom {

    List<AuditoriaRegistro> findByUsuarioIgnoreCase(String usuario);
    List<AuditoriaRegistro> findByTipoIgnoreCase(String tipo);
    List<AuditoriaRegistro> findByModuloIgnoreCase(String modulo);
    List<AuditoriaRegistro> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query(value = "SELECT * FROM auditoria_registro WHERE tipo = :tipo AND severidad = :severidad", nativeQuery = true)
    List<AuditoriaRegistro> buscarPorTipoYSeveridad(@Param("tipo") String tipo, @Param("severidad") String severidad);
}
