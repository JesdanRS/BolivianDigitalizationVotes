package com.votaciones.resultados_estadisticas.service;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaCreacionDto;
import com.votaciones.resultados_estadisticas.dto.ResultadoMesaActualizacionDto;
import com.votaciones.resultados_estadisticas.exception.RecursoNoEncontradoException;
import com.votaciones.resultados_estadisticas.exception.SolicitudInvalidaException;
import com.votaciones.resultados_estadisticas.mapper.ResultadoMesaMapper;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.repository.ResultadoMesaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ResultadoMesaService {

    private final ResultadoMesaRepository repository;
    private final ResultadoMesaMapper mapper;

    @Autowired
    public ResultadoMesaService(ResultadoMesaRepository repository, ResultadoMesaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ResultadoMesaDto> listarTodos() {
        log.info("Listando todos los resultados");
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResultadoMesaDto obtenerPorId(Long id) {
        log.info("Obteniendo resultado con ID: {}", id);
        ResultadoMesa resultado = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("ResultadoMesa no encontrado con ID: " + id));
        return mapper.toDto(resultado);
    }

    @Transactional(readOnly = true)
    public List<ResultadoMesaDto> listarPorDepartamento(String departamento) {
        log.info("Listando resultados del departamento: {}", departamento);
        return repository.findByDepartamento(departamento).stream()
                .map(mapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ResultadoMesaDto> listarPorMunicipio(String municipio) {
        log.info("Listando resultados del municipio: {}", municipio);
        return repository.findByMunicipio(municipio).stream()
                .map(mapper::toDto)
                .toList();
    }

    @Transactional
    public ResultadoMesaDto crear(ResultadoMesaCreacionDto dto) {
        log.info("Creando nuevo resultado para mesa: {} - {}", dto.getDepartamento(), dto.getMesa());
        
        // Verificar si ya existe
        boolean existe = repository.existsByDepartamentoAndMunicipioAndRecintoAndMesa(
                dto.getDepartamento(), dto.getMunicipio(), dto.getRecinto(), dto.getMesa());
        
        if (existe) {
            throw new SolicitudInvalidaException(
                    "Ya existe un resultado para esta mesa: " + dto.getDepartamento() + 
                    " - " + dto.getMunicipio() + " - " + dto.getRecinto() + " - " + dto.getMesa());
        }

        ResultadoMesa resultado = mapper.toEntity(dto);
        ResultadoMesa guardado = repository.save(resultado);
        log.info("Resultado creado con ID: {}", guardado.getId());
        return mapper.toDto(guardado);
    }

    @Transactional
    public ResultadoMesaDto actualizar(Long id, ResultadoMesaActualizacionDto dto) {
        log.info("Actualizando resultado con ID: {}", id);
        
        ResultadoMesa resultado = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("ResultadoMesa no encontrado con ID: " + id));
        
        mapper.updateEntityFromDto(dto, resultado);
        ResultadoMesa actualizado = repository.save(resultado);
        log.info("Resultado actualizado: ID {}", id);
        return mapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando resultado con ID: {}", id);
        if (!repository.existsById(id)) {
            throw new RecursoNoEncontradoException("ResultadoMesa no encontrado con ID: " + id);
        }
        repository.deleteById(id);
        log.info("Resultado eliminado: ID {}", id);
    }

    @Transactional(readOnly = true)
    public List<EstadisticaDto> obtenerEstadisticasPorDepartamento() {
        log.info("Calculando estadísticas por departamento");
        List<ResultadoMesa> resultados = repository.findAll();
        
        Map<String, List<ResultadoMesa>> agrupado = resultados.stream()
                .collect(Collectors.groupingBy(ResultadoMesa::getDepartamento));

        return agrupado.entrySet().stream()
                .map(entry -> calcularEstadistica(entry.getKey(), entry.getValue()))
                .toList();
    }

    @Transactional(readOnly = true)
    public EstadisticaDto obtenerEstadisticaDepartamento(String departamento) {
        log.info("Calculando estadística del departamento: {}", departamento);
        List<ResultadoMesa> resultados = repository.findByDepartamento(departamento);
        
        if (resultados.isEmpty()) {
            throw new RecursoNoEncontradoException("No se encontraron resultados para el departamento: " + departamento);
        }
        
        return calcularEstadistica(departamento, resultados);
    }

    private EstadisticaDto calcularEstadistica(String departamento, List<ResultadoMesa> resultados) {
        long totalVotantes = resultados.stream().mapToLong(ResultadoMesa::getInscritos).sum();
        long votosValidos = resultados.stream().mapToLong(ResultadoMesa::getVotosValidos).sum();
        long votosNulos = resultados.stream().mapToLong(ResultadoMesa::getVotosNulos).sum();
        long votosBlancos = resultados.stream().mapToLong(ResultadoMesa::getVotosBlancos).sum();
        
        long votosValidosPresencial = resultados.stream().mapToLong(ResultadoMesa::getVotosValidosPresencial).sum();
        long votosNulosPresencial = resultados.stream().mapToLong(ResultadoMesa::getVotosNulosPresencial).sum();
        long votosBlancosPresencial = resultados.stream().mapToLong(ResultadoMesa::getVotosBlancosPresencial).sum();
        
        long votosValidosWeb = resultados.stream().mapToLong(ResultadoMesa::getVotosValidosWeb).sum();
        long votosNulosWeb = resultados.stream().mapToLong(ResultadoMesa::getVotosNulosWeb).sum();
        long votosBlancosWeb = resultados.stream().mapToLong(ResultadoMesa::getVotosBlancosWeb).sum();
        
        long totalVotos = votosValidos + votosNulos + votosBlancos;
        double participacion = totalVotantes > 0 ? (totalVotos * 100.0 / totalVotantes) : 0.0;
        
        EstadisticaDto estadistica = new EstadisticaDto();
        estadistica.setDepartamento(departamento);
        estadistica.setTotalVotantes(totalVotantes);
        estadistica.setVotosValidos(votosValidos);
        estadistica.setVotosNulos(votosNulos);
        estadistica.setVotosBlancos(votosBlancos);
        estadistica.setParticipacionPorcentaje(Math.round(participacion * 100.0) / 100.0);
        
        estadistica.setVotosValidosPresencial(votosValidosPresencial);
        estadistica.setVotosNulosPresencial(votosNulosPresencial);
        estadistica.setVotosBlancosPresencial(votosBlancosPresencial);
        estadistica.setVotosValidosWeb(votosValidosWeb);
        estadistica.setVotosNulosWeb(votosNulosWeb);
        estadistica.setVotosBlancosWeb(votosBlancosWeb);
        
        return estadistica;
    }
}
