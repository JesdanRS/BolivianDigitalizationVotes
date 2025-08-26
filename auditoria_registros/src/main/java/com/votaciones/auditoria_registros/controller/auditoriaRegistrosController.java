package com.votaciones.auditoria_registros.controller;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.votaciones.auditoria_registros.exception.ResourceNotFoundException;
import com.votaciones.auditoria_registros.dto.auditoriaRegistrosDto;

@RestController
@RequestMapping("/auditoriaRegistros")

public class auditoriaRegistrosController {
    
    private static final Logger logger = LoggerFactory.getLogger(auditoriaRegistrosController.class);

    @GetMapping("/{id}")
    public auditoriaRegistrosDto getAuditoriaRegistroById(@PathVariable("id") BigDecimal id) {
        logger.info("Request para auditoria registros con id: {}", id);
        if (id == null || id.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResourceNotFoundException("Registro con id " + id + " no encontrado");
        }

        auditoriaRegistrosDto registro = new auditoriaRegistrosDto();
        registro.setId(id.toString());
        registro.setAction("Acción de ejemplo");
        registro.setTimestamp("2023-10-01T12:00:00Z");

        logger.info("Devolver información servicio auditoria registros: {}", registro);
        return registro;
    }
}
