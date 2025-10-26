package com.votaciones.votaciones.repository;

import com.votaciones.votaciones.model.Votacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VotacionRepository extends JpaRepository<Votacion, Long> {
    List<Votacion> findByLocalidadIgnoreCase(String localidad);
}
