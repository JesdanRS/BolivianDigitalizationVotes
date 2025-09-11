package com.votaciones.candidatos.exception;

public class NombreDuplicadoException extends RuntimeException {

	public NombreDuplicadoException(String presidente, String vicepresidente) {
		super("Los nombres de Presidente y Vicepresidente no pueden ser iguales: '" 
			+ presidente + "'");
	}
}


