package com.votaciones.auditoria_registros.util;

import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.http.HttpStatus;

public class HttpErrorInfo {

    private final LocalDateTime timestamp;
    private final String message;
    private final String path;
    private final int status;
    private final Map<String, String> validationErrors;

    public HttpErrorInfo(HttpStatus httpStatus, String path, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = httpStatus.value();
        this.message = message;
        this.path = path;
        this.validationErrors = null;
    }

    // Constructor extendido (con validaciones de DTO)
    public HttpErrorInfo(HttpStatus httpStatus, String path, String message, Map<String, String> validationErrors) {
        this.timestamp = LocalDateTime.now();
        this.status = httpStatus.value();
        this.message = message;
        this.path = path;
        this.validationErrors = validationErrors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public int getStatus() {
        return status;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }
}
