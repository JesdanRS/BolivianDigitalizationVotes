package com.votaciones.candidatos.exception;

/**
 * Excepción lanzada cuando se intenta realizar una operación inválida
 */
public class OperacionInvalidaException extends RuntimeException {

	public OperacionInvalidaException(String mensaje) {
		super(mensaje);
	}
}
