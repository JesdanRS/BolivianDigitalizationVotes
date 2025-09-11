package com.votacion.votaciones.exception;

/**
 * Excepción para solicitudes inválidas en el sistema
 */
public class SolicitudInvalidaException extends RuntimeException {

    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
    }
}