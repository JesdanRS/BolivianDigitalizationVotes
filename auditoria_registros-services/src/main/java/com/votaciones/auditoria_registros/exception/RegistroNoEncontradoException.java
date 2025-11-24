package com.votaciones.auditoria_registros.exception;

public class RegistroNoEncontradoException extends RuntimeException {
    public RegistroNoEncontradoException(Long id) {
        super("Registro con id " + id + " no encontrado");
    }
}