package com.votaciones.resultados_estadisticas.service;

import com.votaciones.resultados_estadisticas.dto.ResultadoPartidoDto;
import com.votaciones.resultados_estadisticas.exception.RecursoNoEncontradoException;
import com.votaciones.resultados_estadisticas.model.ResultadoPartido;
import com.votaciones.resultados_estadisticas.repository.ResultadoPartidoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ResultadoPartidoService {

    private final ResultadoPartidoRepository repository;

    @Autowired
    public ResultadoPartidoService(ResultadoPartidoRepository repository) {
        this.repository = repository;
    }

    /**
     * Incrementa el conteo de votos de un partido de forma atómica.
     * Si el partido no existe, lo crea con un voto.
     */
    @Transactional
    public void incrementarVoto(String partido) {
        log.info("Incrementando voto para partido: {}", partido);

        // Intentar incrementar atómicamente
        int filasActualizadas = repository.incrementarVoto(partido);

        // Si no se actualizó ninguna fila, el partido no existe, crearlo
        if (filasActualizadas == 0) {
            log.info("Partido {} no existe, creando nuevo registro", partido);
            ResultadoPartido nuevoPartido = new ResultadoPartido();
            nuevoPartido.setPartido(partido);
            nuevoPartido.setConteoVotos(1L);
            nuevoPartido.setActualizadoEn(Instant.now());
            repository.save(nuevoPartido);
            log.info("Partido {} creado con 1 voto", partido);
        } else {
            log.info("Voto incrementado para partido: {}", partido);
        }
    }

    /**
     * Obtiene todos los resultados de partidos ordenados por votos (descendente)
     * con porcentajes calculados.
     */
    @Transactional(readOnly = true)
    public List<ResultadoPartidoDto> obtenerResultados() {
        log.info("Obteniendo resultados de todos los partidos");

        List<ResultadoPartido> resultados = repository.findAllOrderByConteoVotosDesc();

        // Calcular total de votos
        long totalVotos = resultados.stream()
                .mapToLong(ResultadoPartido::getConteoVotos)
                .sum();

        log.info("Total de votos en el sistema: {}", totalVotos);

        // Convertir a DTOs con porcentajes
        return resultados.stream()
                .map(resultado -> {
                    ResultadoPartidoDto dto = new ResultadoPartidoDto();
                    dto.setPartido(resultado.getPartido());
                    dto.setConteoVotos(resultado.getConteoVotos());
                    dto.setActualizadoEn(resultado.getActualizadoEn());

                    // Calcular porcentaje
                    double porcentaje = totalVotos > 0
                            ? (resultado.getConteoVotos() * 100.0 / totalVotos)
                            : 0.0;
                    dto.setPorcentaje(Math.round(porcentaje * 100.0) / 100.0);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el resultado de un partido específico con su porcentaje.
     */
    @Transactional(readOnly = true)
    public ResultadoPartidoDto obtenerResultadoPorPartido(String partido) {
        log.info("Obteniendo resultado del partido: {}", partido);

        ResultadoPartido resultado = repository.findByPartido(partido)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontraron resultados para el partido: " + partido));

        // Calcular total de votos para el porcentaje
        long totalVotos = repository.findAll().stream()
                .mapToLong(ResultadoPartido::getConteoVotos)
                .sum();

        ResultadoPartidoDto dto = new ResultadoPartidoDto();
        dto.setPartido(resultado.getPartido());
        dto.setConteoVotos(resultado.getConteoVotos());
        dto.setActualizadoEn(resultado.getActualizadoEn());

        double porcentaje = totalVotos > 0
                ? (resultado.getConteoVotos() * 100.0 / totalVotos)
                : 0.0;
        dto.setPorcentaje(Math.round(porcentaje * 100.0) / 100.0);

        return dto;
    }
}
