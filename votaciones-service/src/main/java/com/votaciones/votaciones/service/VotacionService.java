package com.votaciones.votaciones.service;

import com.votaciones.votaciones.auditoria.AuditoriaClient;
import com.votaciones.votaciones.dto.VotacionCreacionDto;
import com.votaciones.votaciones.dto.VotacionDto;
import com.votaciones.votaciones.exception.RecursoNoEncontradoException;
import com.votaciones.votaciones.mapper.VotacionMapper;
import com.votaciones.votaciones.model.Votacion;
import com.votaciones.votaciones.repository.VotacionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VotacionService {

    private final VotacionRepository votacionRepository;
    private final VotacionMapper votacionMapper;
    private final StreamBridge streamBridge;
    private final AuditoriaClient auditoriaClient;

    // Usuario anónimo para auditoría de votos
    private static final String USUARIO_ANONIMO_VOTO = "00000000"; // 8 dígitos, válido

    @Transactional
    public VotacionDto crear(VotacionCreacionDto dto) {
        // 1) Lógica de negocio principal
        Votacion votacion = votacionMapper.toEntity(dto);
        Votacion guardada = votacionRepository.save(votacion);
        VotacionDto votacionDto = votacionMapper.toDto(guardada);

        // 2) Notificación por Kafka (best-effort)
        try {
            enviarNotificacionVotacion(guardada);
        } catch (Exception ex) {
            log.error("Error enviando notificación Kafka para votación ID {}",
                    guardada.getId(), ex);
        }

        // 3) Enviar a resultados_estadisticas (best-effort)
        try {
            enviarVotacionAResultados(votacionDto);
        } catch (Exception ex) {
            log.error("Error enviando votación ID {} a resultados_estadisticas",
                    votacionDto.getId(), ex);

            // Auditoría del error (con usuario anónimo técnico)
            safeAuditoria(
                    "ERROR",
                    "CRITICAL",
                    "Votaciones",
                    USUARIO_ANONIMO_VOTO,
                    "Error enviando votación ID " + votacionDto.getId()
                            + " a resultados_estadisticas: " + ex.getMessage()
            );
        }

        // 4) Registrar evento de voto emitido (best-effort, SIEMPRE anónimo)
        String detalle = String.format(
                "Voto registrado. Partido=%s, Candidato=%s, Localidad=%s, Fecha=%s",
                guardada.getPartido(),
                guardada.getCandidato(),
                guardada.getLocalidad(),
                guardada.getFecha()
        );

        safeAuditoria(
                "VOTO_EMITIDO",
                "INFO",
                "Votaciones",
                USUARIO_ANONIMO_VOTO, // nunca el CI real
                detalle
        );

        return votacionDto;
    }

    /**
     * Envía una notificación a Kafka cuando se registra una nueva votación
     */
    private void enviarNotificacionVotacion(Votacion votacion) {
        var notificacion = new com.votaciones.notificaciones.dto.NotificacionDto(
                "admin@votaciones.bo", // Email del administrador o sistema
                "Nueva Votación Registrada",
                String.format("Se ha registrado una nueva votación:\n" +
                                "Partido: %s\n" +
                                "Candidato: %s\n" +
                                "Localidad: %s\n" +
                                "Fecha: %s",
                        votacion.getPartido(),
                        votacion.getCandidato(),
                        votacion.getLocalidad(),
                        votacion.getFecha())
        );

        boolean enviado = streamBridge.send("enviarNotificacionVotacion-out-0", notificacion);
        if (!enviado) {
            log.warn("StreamBridge devolvió false al enviar notificación de votación ID {}",
                    votacion.getId());
        } else {
            log.info("Notificación de votación ID {} enviada a Kafka.", votacion.getId());
        }
    }

    /**
     * Envía la votación a resultados_estadisticas para procesamiento
     */
    private void enviarVotacionAResultados(VotacionDto votacionDto) {
        boolean enviado = streamBridge.send("enviarVotacionAResultados-out-0", votacionDto);
        if (!enviado) {
            log.warn("StreamBridge devolvió false al enviar votación ID {} a resultados_estadisticas",
                    votacionDto.getId());
        } else {
            log.info("Votación ID {} enviada a resultados_estadisticas para procesamiento.",
                    votacionDto.getId());
        }
    }

    /**
     * Wrapper “seguro” para auditoría: nunca deja escapar excepciones.
     */
    private void safeAuditoria(
            String tipo,
            String severidad,
            String modulo,
            String usuario,
            String detalle
    ) {
        try {
            auditoriaClient.registrarEvento(
                    tipo,
                    severidad,
                    modulo,
                    usuario,
                    detalle
            );
        } catch (Exception e) {
            log.error("Error registrando evento de auditoría [{} - {} - {}]: {}",
                    tipo, severidad, modulo, e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public VotacionDto obtenerPorId(Long id) {
        Votacion votacion = votacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Votación", id));
        return votacionMapper.toDto(votacion);
    }

    @Transactional(readOnly = true)
    public List<VotacionDto> listar() {
        return votacionRepository.findAll().stream()
                .map(votacionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VotacionDto> buscarPorLocalidad(String localidad) {
        return votacionRepository.findByLocalidadIgnoreCase(localidad).stream()
                .map(votacionMapper::toDto)
                .collect(Collectors.toList());
    }
}