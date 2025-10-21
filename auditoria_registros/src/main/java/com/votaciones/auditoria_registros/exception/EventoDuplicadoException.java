package com.votaciones.auditoria_registros.exception;

public class EventoDuplicadoException extends RuntimeException {
    public EventoDuplicadoException() {
        super("Ya existe un registro idéntico en este momento.");
    }
}
