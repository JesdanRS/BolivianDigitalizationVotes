package com.votaciones.auditoria_registros.service.implementation;

import com.votaciones.auditoria_registros.dto.AuditoriaCreacionDto;
import com.votaciones.auditoria_registros.dto.AuditoriaDto;
import com.votaciones.auditoria_registros.exception.*;
import com.votaciones.auditoria_registros.model.AuditoriaRegistro;
import com.votaciones.auditoria_registros.repository.AuditoriaRegistroRepository;
import com.votaciones.auditoria_registros.service.AuditoriaRegistroService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuditoriaRegistroServiceImpl implements AuditoriaRegistroService {

    private final AuditoriaRegistroRepository repository;

    public AuditoriaRegistroServiceImpl(AuditoriaRegistroRepository repository) {
        this.repository = repository;
    }

    private final Set<String> tiposPermitidos =
            Set.of("LOGIN", "VOTO EMITIDO", "ERROR", "ACTUALIZACION", "CONSULTA", "ELIMINACION");
    private final Set<String> severidadesPermitidas =
            Set.of("INFO", "WARN", "ERROR", "CRITICAL");

    @Override
    public AuditoriaDto crearRegistro(AuditoriaCreacionDto dto) {

        if (!tiposPermitidos.contains(dto.getTipo().toUpperCase())) {
            throw new InvalidArgumentException("Tipo de evento no permitido: " + dto.getTipo());
        }

        if (!severidadesPermitidas.contains(dto.getSeveridad().toUpperCase())) {
            throw new InvalidArgumentException("Severidad no válida: " + dto.getSeveridad());
        }

        if (dto.getUsuario() == null || !dto.getUsuario().matches("\\d{7,10}")) {
            throw new InvalidArgumentException("Usuario inválido. Debe ser una cédula válida.");
        }

        List<AuditoriaRegistro> posibles = repository.findByUsuarioIgnoreCase(dto.getUsuario());
        boolean duplicado = posibles.stream().anyMatch(r ->
                r.getTipo().equalsIgnoreCase(dto.getTipo()) &&
                r.getModulo().equalsIgnoreCase(dto.getModulo()) &&
                r.getDetalle().equalsIgnoreCase(dto.getDetalle()) &&
                Objects.equals(r.getCorrelacion(), dto.getCorrelacion())
        );

        if (duplicado) {
            throw new EventoDuplicadoException("Ya existe un registro idéntico.");
        }

        AuditoriaRegistro nuevo = new AuditoriaRegistro(
                LocalDateTime.now(),
                dto.getTipo(),
                dto.getSeveridad(),
                dto.getModulo(),
                dto.getUsuario(),
                dto.getIp(),
                dto.getCorrelacion(),
                dto.getDetalle()
        );

        AuditoriaRegistro guardado = repository.save(nuevo);
        return convertirADto(guardado);
    }

    @Override
    public List<AuditoriaDto> obtenerRegistros() {
        return repository.findAll()
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public AuditoriaDto obtenerRegistroPorId(Long id) {
        if (id == null || id <= 0) {
            throw new InvalidArgumentException("ID inválido");
        }

        AuditoriaRegistro r = repository.findById(id)
                .orElseThrow(() -> new RegistroNoEncontradoException(id));

        return convertirADto(r);
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorUsuario(String usuario) {
        return repository.findByUsuarioIgnoreCase(usuario)
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorTipo(String tipo) {
        return repository.findByTipoIgnoreCase(tipo)
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorModulo(String modulo) {
        return repository.findByModuloIgnoreCase(modulo)
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditoriaDto> obtenerRegistrosPorRangoFecha(LocalDateTime inicio, LocalDateTime fin) {
        if (inicio == null || fin == null) {
            throw new InvalidArgumentException("Ambas fechas son obligatorias");
        }
        if (inicio.isAfter(fin)) {
            throw new UnprocessableEntityException("El rango de fechas es inválido");
        }

        return repository.findByFechaBetween(inicio, fin)
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean eliminarRegistro(Long id) {
        if (!repository.existsById(id)) {
            throw new RegistroNoEncontradoException(id);
        }
        repository.deleteById(id);
        return true;
    }

    @Override
    public int limpiarRegistrosAntiguos(LocalDateTime limite) {
        // versión simple: cargamos todos y borramos en memoria,
        // en el parcial alcanza. Luego podemos optimizar con query custom.
        List<AuditoriaRegistro> todos = repository.findAll();
        List<AuditoriaRegistro> aBorrar = todos.stream()
                .filter(r -> r.getFecha().isBefore(limite))
                .toList();

        repository.deleteAll(aBorrar);
        return aBorrar.size();
    }

    @Override
    public Map<String, Long> contarEventosPorTipo() {
        return repository.findAll().stream()
                .collect(Collectors.groupingBy(AuditoriaRegistro::getTipo, Collectors.counting()));
    }

    @Override
    public Map<String, Long> contarEventosPorSeveridad() {
        return repository.findAll().stream()
                .collect(Collectors.groupingBy(AuditoriaRegistro::getSeveridad, Collectors.counting()));
    }

    @Override
    public Map<String, Long> contarEventosPorModulo() {
        return repository.findAll().stream()
                .collect(Collectors.groupingBy(AuditoriaRegistro::getModulo, Collectors.counting()));
    }

    @Override
    public Map<String, Object> obtenerResumenEstadistico() {
        List<AuditoriaRegistro> todos = repository.findAll();

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("totalEventos", (long) todos.size());
        resumen.put("porTipo",
                todos.stream().collect(Collectors.groupingBy(AuditoriaRegistro::getTipo, Collectors.counting())));
        resumen.put("porSeveridad",
                todos.stream().collect(Collectors.groupingBy(AuditoriaRegistro::getSeveridad, Collectors.counting())));
        resumen.put("porModulo",
                todos.stream().collect(Collectors.groupingBy(AuditoriaRegistro::getModulo, Collectors.counting())));

        resumen.put("ultimoEvento",
                todos.isEmpty() ? null : convertirADto(todos.get(todos.size() - 1)));

        return resumen;
    }
    
    @Override
    public List<AuditoriaDto> buscarConFiltros(String tipo, String severidad, String modulo,
                                            String usuario, LocalDateTime inicio, LocalDateTime fin) {
        return repository.buscarConFiltros(tipo, severidad, modulo, usuario, inicio, fin)
                        .stream()
                        .map(this::convertirADto)
                        .toList();
    }

    @Override
    public List<String> exportarRegistrosCSV() {
        List<AuditoriaRegistro> todos = repository.findAll();

        List<String> csv = new ArrayList<>();
        csv.add("ID,Fecha,Tipo,Severidad,Modulo,Usuario,IP,Correlacion,Detalle");

        todos.forEach(r -> csv.add(String.join(",",
                String.valueOf(r.getId()),
                r.getFecha().toString(),
                r.getTipo(),
                r.getSeveridad(),
                r.getModulo(),
                r.getUsuario(),
                r.getIp() != null ? r.getIp() : "",
                r.getCorrelacion() != null ? r.getCorrelacion() : "",
                r.getDetalle().replace(",", ";")
        )));

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
