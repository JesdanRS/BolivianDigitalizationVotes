package com.votaciones.auditoria_registros.exception;

public class InvalidArgumentException extends RuntimeException {
    public InvalidArgumentException(String mensaje) {
        super(mensaje != null ? mensaje : "Argumento inválido");
    }
}