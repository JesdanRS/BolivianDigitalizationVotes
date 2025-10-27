package com.votaciones.candidatos.exception;

/**
 * Excepción lanzada cuando las credenciales proporcionadas son inválidas
 */
public class CredencialesInvalidasException extends RuntimeException {

	public CredencialesInvalidasException(String mensaje) {
		super(mensaje);
	}
}
