package com.votacion.votaciones.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.bind.support.WebExchangeBindException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para el microservicio de votaciones
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> manejarRecursoNoEncontrado(
            RecursoNoEncontradoException ex, ServerWebExchange exchange) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("error", "Recurso no encontrado");
        error.put("message", ex.getMessage());
        error.put("path", exchange.getRequest().getPath().value());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(VotanteDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> manejarVotanteDuplicado(
            VotanteDuplicadoException ex, ServerWebExchange exchange) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.CONFLICT.value());
        error.put("error", "Votante duplicado");
        error.put("message", ex.getMessage());
        error.put("path", exchange.getRequest().getPath().value());
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(SolicitudInvalidaException.class)
    public ResponseEntity<Map<String, Object>> manejarSolicitudInvalida(
            SolicitudInvalidaException ex, ServerWebExchange exchange) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Solicitud inválida");
        error.put("message", ex.getMessage());
        error.put("path", exchange.getRequest().getPath().value());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ErrorInternoServidorException.class)
    public ResponseEntity<Map<String, Object>> manejarErrorInternoServidor(
            ErrorInternoServidorException ex, ServerWebExchange exchange) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put("error", "Error interno del servidor");
        error.put("message", ex.getMessage());
        error.put("path", exchange.getRequest().getPath().value());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(WebExchangeBindException.class)
    public ResponseEntity<Map<String, Object>> manejarErroresValidacion(
            WebExchangeBindException ex, ServerWebExchange exchange) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Error de validación");
        
        Map<String, String> erroresValidacion = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            erroresValidacion.put(fieldError.getField(), fieldError.getDefaultMessage());
        });
        
        error.put("message", "Errores de validación en los campos");
        error.put("errors", erroresValidacion);
        error.put("path", exchange.getRequest().getPath().value());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarExcepcionGeneral(
            Exception ex, ServerWebExchange exchange) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now());
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put("error", "Error interno del servidor");
        error.put("message", "Ha ocurrido un error inesperado");
        error.put("path", exchange.getRequest().getPath().value());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}