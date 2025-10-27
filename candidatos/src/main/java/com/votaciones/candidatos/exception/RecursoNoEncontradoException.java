package com.votaciones.candidatos.exception;

/**
 * Excepción lanzada cuando un recurso no es encontrado
 */
public class RecursoNoEncontradoException extends RuntimeException {

	public RecursoNoEncontradoException(String mensaje) {
		super(mensaje);
	}

	public RecursoNoEncontradoException(String recurso, Long id) {
		super(recurso + " con ID " + id + " no encontrado");
	}
}


