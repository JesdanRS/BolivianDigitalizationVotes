package com.votaciones.usuarios.exception;

/**
 * Excepción lanzada cuando no se encuentra un recurso solicitado
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }

    public RecursoNoEncontradoException(String recurso, Long id) {
        super(String.format("%s con ID %d no encontrado", recurso, id));
    }
}

