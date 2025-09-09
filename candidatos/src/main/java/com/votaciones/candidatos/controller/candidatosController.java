package com.votaciones.candidatos.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.votaciones.candidatos.dto.candidatosDto;

@RestController
@RequestMapping("/candidatos")
public class candidatosController {

    private static final Logger logger = LoggerFactory.getLogger(candidatosController.class);

    @GetMapping("/{id}")
    public candidatosDto getCandidatoById(@PathVariable Long id) {
        logger.info("Fetching candidato with id: {}", id);

        candidatosDto candidato = new candidatosDto();
        candidato.setId(id);
        candidato.setName("Candidato " + id);
        candidato.setParty("Partido " + (id % 3));

        return candidato;
    }
}