package com.votaciones.auditoria_registros.dto;

import com.votaciones.auditoria_registros.exception.InvalidArgumentException;

public class auditoriaRegistrosDto {
    private String id;
    private String action;
    private String timestamp;

    public auditoriaRegistrosDto() {
    }

    public auditoriaRegistrosDto(String id, String action, String timestamp) {
        setId(id);
        setAction(action);
        setTimestamp(timestamp);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        if (id == null || id.isEmpty()) {
            throw new InvalidArgumentException("El id no puede ser nulo o vacío");
        }
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        if (action == null || action.isEmpty()) {
            throw new InvalidArgumentException("La acción no puede ser nula o vacía");
        }
        this.action = action;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        if (timestamp == null || timestamp.isEmpty()) {
            throw new InvalidArgumentException("El timestamp no puede ser nulo o vacío");
        }
        this.timestamp = timestamp;
    }
}