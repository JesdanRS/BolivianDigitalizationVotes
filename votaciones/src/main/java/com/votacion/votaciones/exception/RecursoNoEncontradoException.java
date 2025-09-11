package com.votacion.votaciones.exception;

/**
 * Excepción para recursos no encontrados en el sistema
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }

    public RecursoNoEncontradoException(Long id) {
        super("Recurso con ID " + id + " no encontrado");
    }
}