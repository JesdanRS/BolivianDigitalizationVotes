package com.votaciones.candidatos.exception;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;

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

	@ExceptionHandler(WebExchangeBindException.class)
	public ResponseEntity<Map<String, Object>> manejarValidacion(
			WebExchangeBindException ex, ServerWebExchange exchange) {
		Map<String, Object> error = new HashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.BAD_REQUEST.value());
		error.put("error", "Datos de entrada inválidos");
		error.put("message", "Los datos proporcionados no son válidos");
		error.put("path", exchange.getRequest().getPath().value());
		Map<String, String> fieldErrors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(fieldError ->
			fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage())
		);
		error.put("fieldErrors", fieldErrors);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
	}

	@ExceptionHandler({PartidoDuplicadoException.class, NombreDuplicadoException.class, IdDuplicadoException.class})
	public ResponseEntity<Map<String, Object>> manejarDuplicados(RuntimeException ex, ServerWebExchange exchange) {
		Map<String, Object> error = new HashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.CONFLICT.value());
		error.put("error", "Conflicto de datos");
		error.put("message", ex.getMessage());
		error.put("path", exchange.getRequest().getPath().value());
		return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> manejarExcepcionesGenerales(
			Exception ex, ServerWebExchange exchange) {
		Map<String, Object> error = new HashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		error.put("error", "Error interno del servidor");
		error.put("message", "Ocurrió un error inesperado en el servidor");
		error.put("path", exchange.getRequest().getPath().value());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
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
	public ResponseEntity<Map<String, Object>> manejarErrorInternoControlado(
			ErrorInternoServidorException ex, ServerWebExchange exchange) {
		Map<String, Object> error = new HashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		error.put("error", "Error interno del servidor");
		error.put("message", ex.getMessage());
		error.put("path", exchange.getRequest().getPath().value());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}
}


