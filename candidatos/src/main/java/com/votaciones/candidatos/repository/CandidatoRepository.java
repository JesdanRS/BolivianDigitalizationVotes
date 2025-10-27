package com.votaciones.candidatos.repository;

import com.votaciones.candidatos.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad Candidato
 */
@Repository
public interface CandidatoRepository extends JpaRepository<Candidato, Long> {

	/**
	 * Busca una fórmula de candidatos por el carnet del presidente
	 */
	Optional<Candidato> findByCarnetPresidente(String carnetPresidente);

	/**
	 * Busca una fórmula de candidatos por el carnet del vicepresidente
	 */
	Optional<Candidato> findByCarnetVicepresidente(String carnetVicepresidente);

	/**
	 * Busca una fórmula de candidatos por nombre del partido
	 */
	Optional<Candidato> findByPartido(String partido);

	/**
	 * Busca una fórmula de candidatos por correo electrónico
	 */
	Optional<Candidato> findByCorreoElectronico(String correoElectronico);
}
