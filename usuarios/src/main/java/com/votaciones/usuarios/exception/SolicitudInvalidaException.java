package com.votaciones.usuarios.exception;

/**
 * Excepcion para errores de solicitud invalida (HTTP 400)
 */
public class SolicitudInvalidaException extends RuntimeException {

    public SolicitudInvalidaException(String message) {
        super(message);
    }

    public SolicitudInvalidaException(String message, Throwable cause) {
        super(message, cause);
    }
}


