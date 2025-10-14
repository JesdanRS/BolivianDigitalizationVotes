package com.votaciones.resultados_estadisticas.exception;

public class RecursoNoEncontradoException extends RuntimeException {

	public RecursoNoEncontradoException(String recurso, Object id) {
		super(recurso + " con id " + id + " no encontrado");
	}
}


