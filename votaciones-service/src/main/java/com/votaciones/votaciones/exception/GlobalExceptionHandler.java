package com.votaciones.votaciones.exception;

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

	@ExceptionHandler(RecursoNoEncontradoException.class)
	public ResponseEntity<Map<String, Object>> manejarRecursoNoEncontrado(
			RecursoNoEncontradoException ex, HttpServletRequest request) {
		Map<String, Object> error = new HashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.NOT_FOUND.value());
		error.put("error", "Recurso no encontrado");
		error.put("message", ex.getMessage());
		error.put("path", request.getRequestURI());
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> manejarValidacion(
			MethodArgumentNotValidException ex, HttpServletRequest request) {
		Map<String, Object> error = new HashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.BAD_REQUEST.value());
		error.put("error", "Datos de entrada inválidos");
		error.put("message", "Los datos proporcionados no son válidos");
		error.put("path", request.getRequestURI());
		Map<String, String> fieldErrors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(fieldError ->
			fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage())
		);
		error.put("fieldErrors", fieldErrors);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> manejarExcepcionesGenerales(
			Exception ex, HttpServletRequest request) {
		Map<String, Object> error = new HashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		error.put("error", "Error interno del servidor");
		error.put("message", "Ocurrió un error inesperado en el servidor");
		error.put("path", request.getRequestURI());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}
}


