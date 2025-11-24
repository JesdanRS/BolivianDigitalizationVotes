package com.votaciones.auditoria_registros.exception;

public class EventoDuplicadoException extends RuntimeException {
    public EventoDuplicadoException() {
        super("Evento duplicado detectado");
    }

    public EventoDuplicadoException(String mensaje) {
        super(mensaje);
    }
}