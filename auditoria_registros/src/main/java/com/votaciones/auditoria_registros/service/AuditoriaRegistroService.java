package com.votaciones.auditoria_registros.service;

import com.votaciones.auditoria_registros.dto.AuditoriaRegistrosDto;
import com.votaciones.auditoria_registros.model.AuditoriaRegistro;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AuditoriaRegistroService {
    AuditoriaRegistro crearRegistro(AuditoriaRegistrosDto dto);
    List<AuditoriaRegistro> obtenerRegistros();
    AuditoriaRegistro obtenerRegistroPorId(Long id);

    List<AuditoriaRegistro> obtenerRegistrosPorUsuario(String usuario);
    List<AuditoriaRegistro> obtenerRegistrosPorTipo(String tipoEvento);
    List<AuditoriaRegistro> obtenerRegistrosPorRangoFecha(LocalDateTime inicio, LocalDateTime fin);

    boolean eliminarRegistro(Long id);
    int limpiarRegistrosAntiguos(LocalDateTime limite);

    Map<String, Long> contarEventosPorTipo();
    Map<String, Long> obtenerEstadisticasPorTipo();
    List<String> exportarRegistrosCSV();
}
