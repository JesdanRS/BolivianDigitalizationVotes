package com.votacion.votaciones.exception;

/**
 * Excepción para errores internos del servidor
 */
public class ErrorInternoServidorException extends RuntimeException {

    public ErrorInternoServidorException(String mensaje) {
        super(mensaje);
    }

    public ErrorInternoServidorException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}