package com.votaciones.auditoria_registros;

import com.votaciones.auditoria_registros.dto.AuditoriaCreacionDto;
import com.votaciones.auditoria_registros.dto.AuditoriaDto;
import com.votaciones.auditoria_registros.exception.EventoDuplicadoException;
import com.votaciones.auditoria_registros.exception.InvalidArgumentException;
import com.votaciones.auditoria_registros.exception.RegistroNoEncontradoException;
import com.votaciones.auditoria_registros.repository.AuditoriaRegistroRepository;
import com.votaciones.auditoria_registros.service.implementation.AuditoriaRegistroServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test") // usa application-test.yml con H2
class AuditoriaRegistroServiceImplTest {

    @Autowired
    private AuditoriaRegistroServiceImpl service;

    @Autowired
    private AuditoriaRegistroRepository repository;

    @BeforeEach
    void limpiarBD() {
        repository.deleteAll(); // limpia la BD antes de cada test
    }

    private AuditoriaCreacionDto crearDtoValido() {
        AuditoriaCreacionDto dto = new AuditoriaCreacionDto();
        dto.setTipo("LOGIN");
        dto.setSeveridad("INFO");
        dto.setModulo("Usuarios");
        dto.setUsuario("1234567");
        dto.setIp("10.0.0.1");
        dto.setCorrelacion("CORR-TEST-1");
        dto.setDetalle("Inicio de sesión exitoso");
        return dto;
    }

    @Test
    void crearRegistro_valido_devuelveDtoConIdYFecha() {
        AuditoriaCreacionDto dto = crearDtoValido();

        AuditoriaDto creado = service.crearRegistro(dto);

        assertNotNull(creado);
        assertNotNull(creado.getId());
        assertNotNull(creado.getFecha());
        assertEquals("LOGIN", creado.getTipo());
        assertEquals("1234567", creado.getUsuario());
        assertEquals("Usuarios", creado.getModulo());
    }

    @Test
    void crearRegistro_usuarioInvalido_lanzaInvalidArgumentException() {
        AuditoriaCreacionDto dto = crearDtoValido();
        dto.setUsuario("abc");

        assertThrows(InvalidArgumentException.class,
            () -> service.crearRegistro(dto));
    }

    @Test
    void crearRegistro_duplicado_lanzaEventoDuplicadoException() {
        AuditoriaCreacionDto dto = crearDtoValido();
        service.crearRegistro(dto);

        EventoDuplicadoException ex = assertThrows(
            EventoDuplicadoException.class,
            () -> service.crearRegistro(dto)
        );

        assertEquals("Ya existe un registro idéntico.", ex.getMessage());
    }

    @Test
    void obtenerRegistroPorId_existente_devuelveEvento() {
        AuditoriaCreacionDto dto = crearDtoValido();
        AuditoriaDto creado = service.crearRegistro(dto);

        AuditoriaDto buscado = service.obtenerRegistroPorId(creado.getId());

        assertEquals(creado.getId(), buscado.getId());
        assertEquals("LOGIN", buscado.getTipo());
    }

    @Test
    void obtenerRegistroPorId_inexistente_lanzaRegistroNoEncontrado() {
        assertThrows(RegistroNoEncontradoException.class,
            () -> service.obtenerRegistroPorId(999L));
    }

    @Test
    void obtenerRegistros_devuelveListaConEventos() {
        service.crearRegistro(crearDtoValido());

        List<AuditoriaDto> lista = service.obtenerRegistros();

        assertFalse(lista.isEmpty());
        assertEquals(1, lista.size());
    }

    @Test
    void eliminarRegistro_existente_devuelveTrue() {
        AuditoriaDto creado = service.crearRegistro(crearDtoValido());

        boolean ok = service.eliminarRegistro(creado.getId());

        assertTrue(ok);
        assertTrue(service.obtenerRegistros().isEmpty());
    }

    @Test
    void eliminarRegistro_inexistente_lanzaRegistroNoEncontrado() {
        assertThrows(RegistroNoEncontradoException.class,
            () -> service.eliminarRegistro(999L));
    }

    @Test
    void contarEventosPorTipo_devuelveMapaConTotales() {
        AuditoriaCreacionDto dto1 = crearDtoValido();
        service.crearRegistro(dto1);

        AuditoriaCreacionDto dto2 = crearDtoValido();
        dto2.setTipo("ERROR");
        dto2.setDetalle("Fallo de autenticación");
        dto2.setUsuario("7654321");
        service.crearRegistro(dto2);

        Map<String, Long> conteo = service.contarEventosPorTipo();

        assertEquals(2, conteo.size());
        assertEquals(1L, conteo.get("LOGIN"));
        assertEquals(1L, conteo.get("ERROR"));
    }
}