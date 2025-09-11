package com.votaciones.auditoria_registros.service.implementation;

import com.votaciones.auditoria_registros.dto.AuditoriaRegistrosDto;
import com.votaciones.auditoria_registros.exception.*;
import com.votaciones.auditoria_registros.model.AuditoriaRegistro;
import com.votaciones.auditoria_registros.service.AuditoriaRegistroService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class AuditoriaRegistroServiceImpl implements AuditoriaRegistroService {

    private final List<AuditoriaRegistro> registros = new ArrayList<>();
    private final AtomicLong contador = new AtomicLong(1);

    private final Set<String> tiposPermitidos = Set.of("LOGIN", "VOTO EMITIDO", "ERROR");

    @Override
    public AuditoriaRegistro crearRegistro(AuditoriaRegistrosDto dto) {
        if (!tiposPermitidos.contains(dto.getTipoEvento().toUpperCase())) {
            throw new InvalidArgumentException("Tipo de evento no permitido: " + dto.getTipoEvento());
        }
        if (!dto.getUsuario().matches("\\d{7,8}")) {
            throw new InvalidArgumentException("Cédula de identidad inválida. Debe tener 7 a 8 dígitos numéricos");
        }

        boolean existe = registros.stream().anyMatch(r ->
                r.getUsuario().equalsIgnoreCase(dto.getUsuario()) &&
                r.getTipoEvento().equalsIgnoreCase(dto.getTipoEvento()) &&
                r.getDescripcion().equalsIgnoreCase(dto.getDescripcion()) &&
                r.getFechaHora().withNano(0).equals(LocalDateTime.now().withNano(0))
        );

        if (existe) {
            throw new EventoDuplicadoException();
        }

        AuditoriaRegistro registro = new AuditoriaRegistro(
                contador.getAndIncrement(),
                dto.getTipoEvento(),
                dto.getDescripcion(),
                dto.getUsuario(),
                LocalDateTime.now()
        );

        registros.add(registro);
        return registro;
    }

    @Override
    public List<AuditoriaRegistro> obtenerRegistros() {
        return new ArrayList<>(registros);
    }

    @Override
    public AuditoriaRegistro obtenerRegistroPorId(Long id) {
        return registros.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RegistroNoEncontradoException(id));
    }

    @Override
    public List<AuditoriaRegistro> obtenerRegistrosPorUsuario(String usuario) {
        if (usuario == null || usuario.isBlank()) {
            throw new InvalidArgumentException("El usuario es obligatorio para la búsqueda");
        }
        return registros.stream()
                .filter(r -> r.getUsuario().equalsIgnoreCase(usuario))
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaRegistro> obtenerRegistrosPorTipo(String tipoEvento) {
        if (tipoEvento == null || tipoEvento.isBlank()) {
            throw new InvalidArgumentException("El tipo de evento es obligatorio para la búsqueda");
        }
        return registros.stream()
                .filter(r -> r.getTipoEvento().equalsIgnoreCase(tipoEvento))
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaRegistro> obtenerRegistrosPorRangoFecha(LocalDateTime inicio, LocalDateTime fin) {
        if (inicio == null || fin == null) {
            throw new InvalidArgumentException("Ambas fechas son obligatorias");
        }
        if (inicio.isAfter(fin)) {
            throw new UnprocessableEntityException("El rango de fechas es inválido: inicio es posterior a fin");
        }
        return registros.stream()
                .filter(r -> !r.getFechaHora().isBefore(inicio) && !r.getFechaHora().isAfter(fin))
                .collect(Collectors.toList());
    }

    @Override
    public boolean eliminarRegistro(Long id) {
        boolean eliminado = registros.removeIf(r -> r.getId().equals(id));
        if (!eliminado) throw new RegistroNoEncontradoException(id);
        return true;
    }

    @Override
    public int limpiarRegistrosAntiguos(LocalDateTime limite) {
        if (limite.isAfter(LocalDateTime.now())) {
            throw new InvalidArgumentException("La fecha límite no puede ser futura");
        }
        int antes = registros.size();
        registros.removeIf(r -> r.getFechaHora().isBefore(limite));
        return antes - registros.size();
    }

    @Override
    public Map<String, Long> contarEventosPorTipo() {
        return registros.stream()
                .collect(Collectors.groupingBy(AuditoriaRegistro::getTipoEvento, Collectors.counting()));
    }
}