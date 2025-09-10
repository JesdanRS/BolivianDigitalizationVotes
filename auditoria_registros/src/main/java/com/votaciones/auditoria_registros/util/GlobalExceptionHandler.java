package com.votaciones.auditoria_registros.util;

import com.votaciones.auditoria_registros.exception.ResourceNotFoundException;
import com.votaciones.auditoria_registros.exception.DuplicateResourceException;
import com.votaciones.auditoria_registros.exception.InvalidArgumentException;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<HttpErrorInfo> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        HttpErrorInfo errorInfo = new HttpErrorInfo(HttpStatus.NOT_FOUND, request.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(errorInfo, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidArgumentException.class)
    public ResponseEntity<HttpErrorInfo> handleInvalidArgument(InvalidArgumentException ex, HttpServletRequest request) {
        HttpErrorInfo errorInfo = new HttpErrorInfo(HttpStatus.BAD_REQUEST, request.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<HttpErrorInfo> handleDuplicate(DuplicateResourceException ex, HttpServletRequest request) {
        HttpErrorInfo errorInfo = new HttpErrorInfo(HttpStatus.CONFLICT, request.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(errorInfo, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HttpErrorInfo> handleGeneralException(Exception ex, HttpServletRequest request) {
        HttpErrorInfo errorInfo = new HttpErrorInfo(HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI(), "Error interno del servidor");
        return new ResponseEntity<>(errorInfo, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
