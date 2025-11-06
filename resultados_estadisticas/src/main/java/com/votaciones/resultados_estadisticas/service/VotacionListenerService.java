package com.votaciones.resultados_estadisticas.service;

import com.votaciones.votaciones.dto.VotacionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import java.util.function.Consumer;

@Service
@Slf4j
public class VotacionListenerService {

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

            // TODO: Aquí puedes agregar la lógica para procesar la votación
            // Por ejemplo: actualizar estadísticas, registrar resultados, etc.
        };
    }
}

