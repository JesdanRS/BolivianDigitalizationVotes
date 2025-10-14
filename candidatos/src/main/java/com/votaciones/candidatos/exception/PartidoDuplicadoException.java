package com.votaciones.candidatos.exception;

public class PartidoDuplicadoException extends RuntimeException {

	public PartidoDuplicadoException(String partido) {
		super("El partido '" + partido + "' ya está registrado");
	}
}


