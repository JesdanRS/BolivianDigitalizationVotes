package com.votaciones.usuarios.exception;

/**
 * Excepcion para errores internos del servidor (HTTP 500) cuando se desea controlar explicitamente
 */
public class ErrorInternoServidorException extends RuntimeException {

    public ErrorInternoServidorException(String message) {
        super(message);
    }

    public ErrorInternoServidorException(String message, Throwable cause) {
        super(message, cause);
    }
}


