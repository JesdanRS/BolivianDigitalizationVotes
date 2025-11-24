package com.votaciones.auditoria_registros.repository.custom;

import com.votaciones.auditoria_registros.model.AuditoriaRegistro;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AuditoriaRegistroRepositoryImpl implements AuditoriaRegistroRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<AuditoriaRegistro> buscarConFiltros(String tipo, String severidad, String modulo,
                                                    String usuario, LocalDateTime inicio, LocalDateTime fin) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<AuditoriaRegistro> cq = cb.createQuery(AuditoriaRegistro.class);
        Root<AuditoriaRegistro> root = cq.from(AuditoriaRegistro.class);

        List<Predicate> predicates = new ArrayList<>();

        if (tipo != null && !tipo.isBlank())
            predicates.add(cb.equal(cb.upper(root.get("tipo")), tipo.toUpperCase()));

        if (severidad != null && !severidad.isBlank())
            predicates.add(cb.equal(cb.upper(root.get("severidad")), severidad.toUpperCase()));

        if (modulo != null && !modulo.isBlank())
            predicates.add(cb.like(cb.upper(root.get("modulo")), "%" + modulo.toUpperCase() + "%"));

        if (usuario != null && !usuario.isBlank())
            predicates.add(cb.equal(root.get("usuario"), usuario));

        if (inicio != null && fin != null)
            predicates.add(cb.between(root.get("fecha"), inicio, fin));

        cq.select(root).where(predicates.toArray(new Predicate[0]));
        cq.orderBy(cb.desc(root.get("fecha")));

        return entityManager.createQuery(cq).getResultList();
    }
}