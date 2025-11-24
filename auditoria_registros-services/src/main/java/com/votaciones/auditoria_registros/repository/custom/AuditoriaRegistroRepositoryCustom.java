package com.votaciones.auditoria_registros.repository.custom;

import com.votaciones.auditoria_registros.model.AuditoriaRegistro;
import java.time.LocalDateTime;
import java.util.List;

public interface AuditoriaRegistroRepositoryCustom {
    List<AuditoriaRegistro> buscarConFiltros(
            String tipo,
            String severidad,
            String modulo,
            String usuario,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}
