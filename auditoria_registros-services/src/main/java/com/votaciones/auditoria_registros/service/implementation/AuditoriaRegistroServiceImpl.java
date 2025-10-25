package com.votaciones.auditoria_registros.service.implementation;

import com.votaciones.auditoria_registros.dto.AuditoriaCreacionDto;
import com.votaciones.auditoria_registros.dto.AuditoriaDto;
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

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "LOGIN", "VOTO EMITIDO", "ERROR", "ACTUALIZACIÓN", "CONSULTA", "USUARIO CREADO"
    );
    private static final Set<String> SEVERIDADES_PERMITIDAS = Set.of(
            "INFO", "WARN", "ERROR", "CRITICAL"
    );

    @Override
    public AuditoriaDto crearRegistro(AuditoriaCreacionDto dto) {

        if (dto.getTipo() == null || !TIPOS_PERMITIDOS.contains(dto.getTipo().toUpperCase())) {
            throw new InvalidArgumentException("Tipo de evento no permitido: " + dto.getTipo());
        }

        if (dto.getSeveridad() == null || !SEVERIDADES_PERMITIDAS.contains(dto.getSeveridad().toUpperCase())) {
            throw new InvalidArgumentException("Severidad no válida: " + dto.getSeveridad());
        }

        if (dto.getUsuario() == null || !dto.getUsuario().matches("\\d{7,10}")) {
            throw new InvalidArgumentException("Usuario inválido. Debe ser un número de cédula válido.");
        }

        String correlacion = (dto.getCorrelacion() == null || dto.getCorrelacion().isBlank())
                ? "CORR-" + UUID.randomUUID()
                : dto.getCorrelacion();

        boolean duplicado = registros.stream().anyMatch(r ->
                r.getUsuario().equalsIgnoreCase(dto.getUsuario()) &&
                r.getTipo().equalsIgnoreCase(dto.getTipo()) &&
                r.getModulo().equalsIgnoreCase(dto.getModulo()) &&
                r.getDetalle().equalsIgnoreCase(dto.getDetalle()) &&
                r.getCorrelacion().equalsIgnoreCase(correlacion)
        );

        if (duplicado) {
            throw new EventoDuplicadoException("Ya existe un registro idéntico.");
        }

        AuditoriaRegistro nuevo = new AuditoriaRegistro(
                contador.getAndIncrement(),
                LocalDateTime.now(),
                dto.getTipo().toUpperCase(),
                dto.getSeveridad().toUpperCase(),
                dto.getModulo(),
                dto.getUsuario(),
                dto.getIp(),
                correlacion,
                dto.getDetalle()
        );

        registros.add(nuevo);
        return convertirADto(nuevo);
    }

    @Override
    public List<AuditoriaDto> obtenerRegistros() {
        return registros.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public AuditoriaDto obtenerRegistroPorId(Long id) {
        if (id == null || id <= 0) {
            throw new InvalidArgumentException("ID inválido");
        }

        return registros.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .map(this::convertirADto)
                .orElseThrow(() -> new RegistroNoEncontradoException(id));
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorUsuario(String usuario) {
        if (usuario == null || usuario.isBlank()) {
            throw new InvalidArgumentException("Usuario no puede estar vacío");
        }

        return registros.stream()
                .filter(r -> r.getUsuario().equalsIgnoreCase(usuario))
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) {
            throw new InvalidArgumentException("El tipo de evento es obligatorio");
        }

        return registros.stream()
                .filter(r -> r.getTipo().equalsIgnoreCase(tipo))
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorModulo(String modulo) {
        if (modulo == null || modulo.isBlank()) {
            throw new InvalidArgumentException("El módulo es obligatorio");
        }

        return registros.stream()
                .filter(r -> r.getModulo().equalsIgnoreCase(modulo))
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorRangoFecha(LocalDateTime inicio, LocalDateTime fin) {
        if (inicio == null || fin == null) {
            throw new InvalidArgumentException("Ambas fechas son obligatorias");
        }
        if (inicio.isAfter(fin)) {
            throw new UnprocessableEntityException("El rango de fechas es inválido: inicio posterior al fin");
        }

        return registros.stream()
                .filter(r -> !r.getFecha().isBefore(inicio) && !r.getFecha().isAfter(fin))
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean eliminarRegistro(Long id) {
        boolean eliminado = registros.removeIf(r -> r.getId().equals(id));
        if (!eliminado) {
            throw new RegistroNoEncontradoException(id);
        }
        return true;
    }

    @Override
    public int limpiarRegistrosAntiguos(LocalDateTime limite) {
        if (limite == null) {
            throw new InvalidArgumentException("La fecha límite no puede ser nula");
        }
        if (limite.isAfter(LocalDateTime.now())) {
            throw new InvalidArgumentException("La fecha límite no puede ser futura");
        }

        int antes = registros.size();
        registros.removeIf(r -> r.getFecha().isBefore(limite));
        return antes - registros.size();
    }

    @Override
    public Map<String, Long> contarEventosPorTipo() {
        return registros.stream()
                .collect(Collectors.groupingBy(AuditoriaRegistro::getTipo, Collectors.counting()));
    }

    @Override
    public Map<String, Long> contarEventosPorSeveridad() {
        return registros.stream()
                .collect(Collectors.groupingBy(AuditoriaRegistro::getSeveridad, Collectors.counting()));
    }

    @Override
    public Map<String, Long> contarEventosPorModulo() {
        return registros.stream()
                .collect(Collectors.groupingBy(AuditoriaRegistro::getModulo, Collectors.counting()));
    }

    @Override
    public Map<String, Object> obtenerResumenEstadistico() {
        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("totalEventos", (long) registros.size());
        resumen.put("porTipo", contarEventosPorTipo());
        resumen.put("porSeveridad", contarEventosPorSeveridad());
        resumen.put("porModulo", contarEventosPorModulo());
        resumen.put("ultimoEvento",
                registros.isEmpty() ? null : convertirADto(registros.get(registros.size() - 1)));
        return resumen;
    }

    @Override
    public List<String> exportarRegistrosCSV() {
        List<String> csv = new ArrayList<>();
        csv.add("ID,Fecha,Tipo,Severidad,Modulo,Usuario,IP,Correlacion,Detalle");
        registros.forEach(r -> csv.add(String.join(",",
                String.valueOf(r.getId()),
                r.getFecha().toString(),
                r.getTipo(),
                r.getSeveridad(),
                r.getModulo(),
                r.getUsuario(),
                r.getIp(),
                r.getCorrelacion(),
                r.getDetalle().replace(",", ";"))));
        return csv;
    }

    private AuditoriaDto convertirADto(AuditoriaRegistro r) {
        return new AuditoriaDto(
                r.getId(),
                r.getFecha(),
                r.getTipo(),
                r.getSeveridad(),
                r.getModulo(),
                r.getUsuario(),
                r.getIp(),
                r.getCorrelacion(),
                r.getDetalle()
        );
    }
}