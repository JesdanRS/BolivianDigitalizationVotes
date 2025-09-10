package com.votaciones.auditoria_registros.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.votaciones.auditoria_registros.exception.ResourceNotFoundException;
import com.votaciones.auditoria_registros.dto.AuditoriaRegistrosDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/auditoriaRegistros")

public class AuditoriaRegistrosController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuditoriaRegistrosController.class);

    @Operation(
        summary = "${api.auditoriaRegistros.get-auditoriaRegistro.description}",
        description = "${api.auditoriaRegistros.get-auditoriaRegistro.notes}"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "${api.responseCodes.ok.description}"),
        @ApiResponse(responseCode = "404", description = "${api.responseCodes.notFound.description}")
    })
    @GetMapping(value = "/{id}", produces = "application/json")
    public AuditoriaRegistrosDto getAuditoriaRegistroById(@PathVariable("id") int id) {
        logger.info("Request para auditoria registros con id: {}", id);
        if (id <= 0) {
            throw new ResourceNotFoundException("Registro con id " + id + " no encontrado");
        }

        AuditoriaRegistrosDto registro = new AuditoriaRegistrosDto();
        registro.setId(String.valueOf(id));
        registro.setAction("Acción de ejemplo");
        registro.setTimestamp("2023-10-01T12:00:00Z");

        logger.info("Devolver información servicio auditoria registros: {}", registro);
        return registro;
    }
}
