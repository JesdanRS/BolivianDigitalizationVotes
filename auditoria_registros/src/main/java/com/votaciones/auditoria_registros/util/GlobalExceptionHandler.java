package com.votaciones.auditoria_registros.util;

import com.votaciones.auditoria_registros.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //Validaciones de DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<HttpErrorInfo> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String campo = ((FieldError) error).getField();
            String mensaje = error.getDefaultMessage();
            errores.put(campo, mensaje);
        });
        return new ResponseEntity<>(
                new HttpErrorInfo(HttpStatus.BAD_REQUEST, request.getDescription(false), errores.toString()),
                HttpStatus.BAD_REQUEST
        );
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
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, request.getDescription(false), "Error interno del servidor");
    }

    //Método privado para construir HttpErrorInfo
    private ResponseEntity<HttpErrorInfo> buildError(HttpStatus status, String path, String mensaje) {
        return new ResponseEntity<>(
                new HttpErrorInfo(status, path, mensaje),
                status
        );
    }
}
