package com.votaciones.auditoria_registros.util;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

public class HttpErrorInfo {

    private final LocalDateTime timestamp;
    private final String message;
    private final String path;
    private final int status;

    public HttpErrorInfo(HttpStatus httpStatus, String path, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = httpStatus.value();
        this.message = message;
        this.path = path;
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
}
