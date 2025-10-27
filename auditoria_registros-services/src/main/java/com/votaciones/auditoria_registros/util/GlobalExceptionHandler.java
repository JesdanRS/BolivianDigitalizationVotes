package com.votaciones.auditoria_registros.util;

import com.votaciones.auditoria_registros.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Validaciones @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Datos de entrada inválidos");
        error.put("message", "Error de validación en los campos enviados");
        error.put("path", request.getRequestURI());

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
            InvalidArgumentException ex, HttpServletRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, "Solicitud inválida", ex.getMessage(), request);
    }

    // EventoDuplicadoException -> 409
    @ExceptionHandler(EventoDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> handleEventoDuplicado(
            EventoDuplicadoException ex, HttpServletRequest request) {
        return buildError(HttpStatus.CONFLICT, "Conflicto de datos", ex.getMessage(), request);
    }

    // RegistroNoEncontradoException -> 404
    @ExceptionHandler(RegistroNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleRegistroNoEncontrado(
            RegistroNoEncontradoException ex, HttpServletRequest request) {
        return buildError(HttpStatus.NOT_FOUND, "Recurso no encontrado", ex.getMessage(), request);
    }

    // UnprocessableEntityException -> 422
    @ExceptionHandler(UnprocessableEntityException.class)
    public ResponseEntity<Map<String, Object>> handleUnprocessableEntity(
            UnprocessableEntityException ex, HttpServletRequest request) {
        return buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Entidad no procesable", ex.getMessage(), request);
    }

    // Excepción general -> 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(
            Exception ex, HttpServletRequest request) {
        ex.printStackTrace(); // Para debugging
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor",
                "Ocurrió un error inesperado en el servidor", request);
    }

    // Método privado para construir la respuesta
    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String errorType,
                                                           String message, HttpServletRequest request) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", status.value());
        error.put("error", errorType);
        error.put("message", message);
        error.put("path", request.getRequestURI());

        return ResponseEntity.status(status).body(error);
    }
}
