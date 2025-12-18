package com.votaciones.resultados_estadisticas.service;

import com.votaciones.votaciones.dto.VotacionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import java.util.function.Consumer;

@Service
@Slf4j
public class VotacionListenerService {

    private final ResultadoPartidoService resultadoPartidoService;

    @Autowired
    public VotacionListenerService(ResultadoPartidoService resultadoPartidoService) {
        this.resultadoPartidoService = resultadoPartidoService;
    }

    /**
     * Consumer que procesa mensajes de votaciones recibidos desde Kafka.
     * Spring Cloud Stream buscará un Bean de tipo Consumer cuyo nombre
     * coincida con la parte 'procesarVotacion' del binding configurado.
     */
    @Bean
    public Consumer<VotacionDto> procesarVotacion() {
        return votacion -> {
            // Este es el código que se ejecuta cuando llega un mensaje de Kafka.
            log.info("===================================================");
            log.info("RECIBIDA NUEVA VOTACIÓN DESDE VOTACIONES-SERVICE:");
            log.info("ID: {}", votacion.getId());
            log.info("Partido: {}", votacion.getPartido());
            log.info("Candidato: {}", votacion.getCandidato());
            log.info("Localidad: {}", votacion.getLocalidad());
            log.info("Fecha: {}", votacion.getFecha());
            log.info("===================================================");

            // Procesar la votación: incrementar conteo del partido
            try {
                if (votacion.getPartido() != null && !votacion.getPartido().isBlank()) {
                    resultadoPartidoService.incrementarVoto(votacion.getPartido());
                    log.info("Voto procesado exitosamente para partido: {}", votacion.getPartido());
                } else {
                    log.warn("Votación ID {} sin partido válido, ignorando", votacion.getId());
                }
            } catch (Exception e) {
                log.error("Error procesando votación ID {}: {}", votacion.getId(), e.getMessage(), e);
            }
        };
    }
}
