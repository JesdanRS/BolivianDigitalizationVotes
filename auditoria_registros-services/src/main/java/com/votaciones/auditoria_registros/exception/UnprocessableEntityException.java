package com.votaciones.auditoria_registros.exception;

public class UnprocessableEntityException extends RuntimeException {
    public UnprocessableEntityException(String mensaje) {
        super(mensaje != null ? mensaje : "No se puede procesar la entidad");
    }
}   