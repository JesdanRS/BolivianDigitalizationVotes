package com.votaciones.candidatos.exception;

public class IdDuplicadoException extends RuntimeException {

	public IdDuplicadoException(Long id) {
		super("El ID de candidato ya existe: " + id);
	}
}


