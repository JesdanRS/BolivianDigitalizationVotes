package com.votaciones.resultados_estadisticas.repository.custom;

import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación de consultas personalizadas usando JPA Criteria API
 * Esta implementación demuestra el uso de Criteria Query para consultas dinámicas
 */
@Repository
public class ResultadoMesaRepositoryImpl implements ResultadoMesaRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ResultadoMesa> buscarConFiltros(String departamento, String municipio, 
                                                String recinto, Long votosMinimos) {
        
        // Crear el CriteriaBuilder para construir la consulta
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ResultadoMesa> cq = cb.createQuery(ResultadoMesa.class);
        Root<ResultadoMesa> root = cq.from(ResultadoMesa.class);

        // Lista de predicados (condiciones WHERE)
        List<Predicate> predicates = new ArrayList<>();

        // Filtro por departamento (case-insensitive)
        if (departamento != null && !departamento.isBlank()) {
            predicates.add(cb.equal(
                cb.upper(root.get("departamento")), 
                departamento.toUpperCase()
            ));
        }

        // Filtro por municipio (case-insensitive)
        if (municipio != null && !municipio.isBlank()) {
            predicates.add(cb.equal(
                cb.upper(root.get("municipio")), 
                municipio.toUpperCase()
            ));
        }

        // Filtro por recinto (case-insensitive con LIKE)
        if (recinto != null && !recinto.isBlank()) {
            predicates.add(cb.like(
                cb.upper(root.get("recinto")), 
                "%" + recinto.toUpperCase() + "%"
            ));
        }

        // Filtro por votos válidos mínimos (suma de presencial + web)
        if (votosMinimos != null && votosMinimos > 0) {
            Expression<Long> votosValidosTotales = cb.sum(
                root.get("votosValidosPresencial"),
                root.get("votosValidosWeb")
            );
            predicates.add(cb.greaterThanOrEqualTo(votosValidosTotales, votosMinimos));
        }

        // Aplicar todos los predicados con AND
        cq.select(root).where(predicates.toArray(new Predicate[0]));
        
        // Ordenar por departamento y luego por municipio
        cq.orderBy(
            cb.asc(root.get("departamento")),
            cb.asc(root.get("municipio")),
            cb.asc(root.get("recinto"))
        );

        // Ejecutar la consulta y retornar resultados
        return entityManager.createQuery(cq).getResultList();
    }
}
