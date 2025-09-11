package com.votacion.votaciones.exception;

/**
 * Excepción para cuando un votante intenta votar más de una vez
 */
public class VotanteDuplicadoException extends RuntimeException {

    public VotanteDuplicadoException(String carnet) {
        super("El votante con carnet " + carnet + " ya ha emitido su voto");
    }
}