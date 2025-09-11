package com.votaciones.auditoria_registros.util;

import com.votaciones.auditoria_registros.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Manejo de validaciones @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<HttpErrorInfo> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            WebRequest request) {

        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                validationErrors.put(error.getField(), error.getDefaultMessage())
        );

        HttpErrorInfo errorInfo = new HttpErrorInfo(
                HttpStatus.BAD_REQUEST,
                request.getDescription(false).replace("uri=", ""),
                "Error de validación en los campos enviados",
                validationErrors
        );

        return ResponseEntity.badRequest().body(errorInfo);
    }

    //Reglas de negocio
    @ExceptionHandler(InvalidArgumentException.class)
    public ResponseEntity<HttpErrorInfo> handleInvalidArgument(InvalidArgumentException ex, WebRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, request.getDescription(false), ex.getMessage());
    }

    @ExceptionHandler(UnprocessableEntityException.class)
    public ResponseEntity<HttpErrorInfo> handleUnprocessableEntity(UnprocessableEntityException ex, WebRequest request) {
        return buildError(HttpStatus.UNPROCESSABLE_ENTITY, request.getDescription(false), ex.getMessage());
    }

    @ExceptionHandler(EventoDuplicadoException.class)
    public ResponseEntity<HttpErrorInfo> handleEventoDuplicado(EventoDuplicadoException ex, WebRequest request) {
        return buildError(HttpStatus.CONFLICT, request.getDescription(false), ex.getMessage());
    }

    @ExceptionHandler(RegistroNoEncontradoException.class)
    public ResponseEntity<HttpErrorInfo> handleRegistroNoEncontrado(RegistroNoEncontradoException ex, WebRequest request) {
        return buildError(HttpStatus.NOT_FOUND, request.getDescription(false), ex.getMessage());
    }

    //Excepción general
    @ExceptionHandler(Exception.class)
    public ResponseEntity<HttpErrorInfo> handleGeneral(Exception ex, WebRequest request) {
        HttpErrorInfo errorInfo = new HttpErrorInfo(
                HttpStatus.INTERNAL_SERVER_ERROR,
                request.getDescription(false).replace("uri=", ""),
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorInfo);
    }

    //Método privado para construir HttpErrorInfo
    private ResponseEntity<HttpErrorInfo> buildError(HttpStatus status, String path, String mensaje) {
        return new ResponseEntity<>(
                new HttpErrorInfo(status, path, mensaje),
                status
        );
    }
}
