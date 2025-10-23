package com.votaciones.auditoria_registros.util;

import com.votaciones.auditoria_registros.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Validaciones @Valid
    @ExceptionHandler(WebExchangeBindException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            WebExchangeBindException ex, ServerWebExchange exchange) {

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Datos de entrada inválidos");
        error.put("message", "Error de validación en los campos enviados");
        error.put("path", exchange.getRequest().getPath().value());

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(f ->
                fieldErrors.put(f.getField(), f.getDefaultMessage())
        );
        error.put("fieldErrors", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // InvalidArgumentException -> 400
    @ExceptionHandler(InvalidArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidArgument(
            InvalidArgumentException ex, ServerWebExchange exchange) {
        return buildError(HttpStatus.BAD_REQUEST, "Solicitud inválida", ex.getMessage(), exchange);
    }

    // EventoDuplicadoException -> 409
    @ExceptionHandler(EventoDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> handleEventoDuplicado(
            EventoDuplicadoException ex, ServerWebExchange exchange) {
        return buildError(HttpStatus.CONFLICT, "Conflicto de datos", ex.getMessage(), exchange);
    }

    // RegistroNoEncontradoException -> 404
    @ExceptionHandler(RegistroNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleRegistroNoEncontrado(
            RegistroNoEncontradoException ex, ServerWebExchange exchange) {
        return buildError(HttpStatus.NOT_FOUND, "Recurso no encontrado", ex.getMessage(), exchange);
    }

    // UnprocessableEntityException -> 422
    @ExceptionHandler(UnprocessableEntityException.class)
    public ResponseEntity<Map<String, Object>> handleUnprocessableEntity(
            UnprocessableEntityException ex, ServerWebExchange exchange) {
        return buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Entidad no procesable", ex.getMessage(), exchange);
    }

    // Excepción general -> 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(
            Exception ex, ServerWebExchange exchange) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor",
                "Ocurrió un error inesperado en el servidor", exchange);
    }

    // Método privado para construir la respuesta
    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String errorType,
                                                           String message, ServerWebExchange exchange) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", status.value());
        error.put("error", errorType);
        error.put("message", message);
        error.put("path", exchange.getRequest().getPath().value());

        return ResponseEntity.status(status).body(error);
    }
}
