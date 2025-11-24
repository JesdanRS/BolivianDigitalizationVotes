package com.votaciones.auditoria_registros.service;

import com.votaciones.auditoria_registros.dto.AuditoriaCreacionDto;
import com.votaciones.auditoria_registros.dto.AuditoriaDto;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AuditoriaRegistroService {

    AuditoriaDto crearRegistro(AuditoriaCreacionDto dto);

    List<AuditoriaDto> obtenerRegistros();

    AuditoriaDto obtenerRegistroPorId(Long id);

    List<AuditoriaDto> obtenerRegistrosPorUsuario(String usuario);

    List<AuditoriaDto> obtenerRegistrosPorTipo(String tipo);

    List<AuditoriaDto> obtenerRegistrosPorModulo(String modulo);

    List<AuditoriaDto> obtenerRegistrosPorRangoFecha(LocalDateTime inicio, LocalDateTime fin);

    boolean eliminarRegistro(Long id);

    int limpiarRegistrosAntiguos(LocalDateTime limite);

    // KPIs para dashboard
    Map<String, Long> contarEventosPorTipo();

    Map<String, Long> contarEventosPorSeveridad();

    Map<String, Long> contarEventosPorModulo();

    Map<String, Object> obtenerResumenEstadistico();

    List<AuditoriaDto> buscarConFiltros(String tipo, String severidad, String modulo,
                                    String usuario, LocalDateTime inicio, LocalDateTime fin);

    List<String> exportarRegistrosCSV();
}