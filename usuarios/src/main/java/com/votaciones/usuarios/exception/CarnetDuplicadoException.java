package com.votaciones.usuarios.exception;

/**
 * Excepción lanzada cuando se intenta crear un usuario con un carnet ya existente
 */
public class CarnetDuplicadoException extends RuntimeException {

    public CarnetDuplicadoException(String carnet) {
        super(String.format("Ya existe un usuario con el carnet: %s", carnet));
    }
}

