package com.votaciones.auditoria_registros;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.votaciones.auditoria_registros.dto.AuditoriaRegistrosDto;
import com.votaciones.auditoria_registros.exception.EventoDuplicadoException;
import com.votaciones.auditoria.lib.model.AuditoriaRegistro;
import com.votaciones.auditoria_registros.service.AuditoriaRegistroService;
import com.votaciones.auditoria_registros.service.implementation.AuditoriaRegistroServiceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;

@SpringBootTest
class AuditoriaRegistrosApplicationTests {

	private AuditoriaRegistroService service;

    @BeforeEach
    void setUp() {
        service = new AuditoriaRegistroServiceImpl();
    }

	@Test
    void crearRegistro_valido_deberiaRetornarRegistro() {
        AuditoriaRegistrosDto dto = new AuditoriaRegistrosDto();
        dto.setTipoEvento("LOGIN");
        dto.setDescripcion("Usuario inició sesión");
        dto.setUsuario("1234567");

        AuditoriaRegistro registro = service.crearRegistro(dto);

        assertNotNull(registro);
        assertEquals("LOGIN", registro.getTipoEvento());
        assertEquals("1234567", registro.getUsuario());
    }

	@Test
	void crearRegistro_duplicado_deberiaLanzarExcepcion() {
		AuditoriaRegistrosDto dto = new AuditoriaRegistrosDto();
		dto.setTipoEvento("LOGIN");
		dto.setDescripcion("Usuario inició sesión");
		dto.setUsuario("1234567");

		service.crearRegistro(dto);

		assertThrows(EventoDuplicadoException.class, () -> service.crearRegistro(dto));

		EventoDuplicadoException ex = assertThrows(EventoDuplicadoException.class, () -> service.crearRegistro(dto));
		assertEquals("Ya existe un registro idéntico en este momento.", ex.getMessage());
	}

}
