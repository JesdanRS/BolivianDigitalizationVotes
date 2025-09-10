package com.votaciones.usuarios.exception;

/**
 * Excepción lanzada cuando se intenta crear un usuario con un email ya existente
 */
public class EmailDuplicadoException extends RuntimeException {

    public EmailDuplicadoException(String email) {
        super(String.format("Ya existe un usuario con el email: %s", email));
    }
}

