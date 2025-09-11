package com.votacion.votaciones.service;

import com.votacion.votaciones.dto.VotacionCreacionDto;
import com.votacion.votaciones.dto.VotacionDto;
import com.votacion.votaciones.exception.RecursoNoEncontradoException;
import com.votacion.votaciones.exception.VotanteDuplicadoException;
import com.votacion.votaciones.model.Votacion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Servicio para la gestión de votaciones en el sistema de votaciones bolivianas
 */
@Service
public class VotacionService {

    private final List<Votacion> votaciones = new ArrayList<>();
    private final AtomicLong contadorId = new AtomicLong(1);

    /**
     * Registra una nueva votación
     */
    public VotacionDto registrarVotacion(VotacionCreacionDto dto) {
        // Validar que el votante no haya votado antes
        if (existeVotante(dto.getCarnetVotante())) {
            throw new VotanteDuplicadoException(dto.getCarnetVotante());
        }

        Votacion votacion = new Votacion(
            dto.getCarnetVotante(),
            dto.getNombreCompletoVotante(),
            dto.getMesaVotacion(),
            dto.getRecinto(),
            dto.getDepartamento(),
            dto.getMunicipio(),
            dto.getCandidatoSeleccionado(),
            dto.getPartidoPolitico()
        );

        // Asignar ID y timestamps
        votacion.setId(contadorId.getAndIncrement());
        votacion.prePersist();

        // Guardar en la lista (simulando base de datos)
        votaciones.add(votacion);

        return VotacionDto.fromEntity(votacion);
    }

    /**
     * Obtiene una votación por su ID
     */
    public VotacionDto obtenerVotacionPorId(Long id) {
        Votacion votacion = votaciones.stream()
            .filter(v -> v.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RecursoNoEncontradoException(id));

        return VotacionDto.fromEntity(votacion);
    }

    /**
     * Obtiene todas las votaciones
     */
    public List<VotacionDto> obtenerTodasLasVotaciones() {
        return votaciones.stream()
            .map(VotacionDto::fromEntity)
            .toList();
    }

    /**
     * Verifica una votación
     */
    public VotacionDto verificarVotacion(Long id) {
        Votacion votacion = votaciones.stream()
            .filter(v -> v.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RecursoNoEncontradoException(id));

        votacion.setVotacionVerificada(true);
        votacion.preUpdate();

        return VotacionDto.fromEntity(votacion);
    }

    /**
     * Obtiene votaciones por departamento
     */
    public List<VotacionDto> obtenerVotacionesPorDepartamento(String departamento) {
        return votaciones.stream()
            .filter(v -> v.getDepartamento().equalsIgnoreCase(departamento))
            .map(VotacionDto::fromEntity)
            .toList();
    }

    /**
     * Obtiene votaciones por mesa de votación
     */
    public List<VotacionDto> obtenerVotacionesPorMesa(String mesaVotacion) {
        return votaciones.stream()
            .filter(v -> v.getMesaVotacion().equalsIgnoreCase(mesaVotacion))
            .map(VotacionDto::fromEntity)
            .toList();
    }

    /**
     * Obtiene votaciones por recinto
     */
    public List<VotacionDto> obtenerVotacionesPorRecinto(String recinto) {
        return votaciones.stream()
            .filter(v -> v.getRecinto().equalsIgnoreCase(recinto))
            .map(VotacionDto::fromEntity)
            .toList();
    }

    /**
     * Verifica si un votante ya ha emitido su voto
     */
    private boolean existeVotante(String carnet) {
        return votaciones.stream()
            .anyMatch(v -> v.getCarnetVotante().equals(carnet));
    }
}