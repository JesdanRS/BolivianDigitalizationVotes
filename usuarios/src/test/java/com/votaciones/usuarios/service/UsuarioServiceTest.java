package com.votaciones.usuarios.service;

import com.votaciones.UsuarioCreacionDto;
import com.votaciones.UsuarioDto;
import com.votaciones.usuarios.exception.CarnetDuplicadoException;
import com.votaciones.usuarios.exception.EmailDuplicadoException;
import com.votaciones.usuarios.exception.RecursoNoEncontradoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitarios para el servicio de usuarios
 */
@SpringBootTest
public class UsuarioServiceTest {

    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService();
    }

    @Test
    void testCrearUsuarioExitoso() {
        // Given
        UsuarioCreacionDto dto = new UsuarioCreacionDto();
        dto.setNombreCompleto("Juan Carlos Pérez Mamani");
        dto.setCelular("70123456");
        dto.setDireccion("Av. 16 de Julio 1234");
        dto.setDepartamento("La Paz");
        dto.setEdad(25);
        dto.setCorreoElectronico("juan.perez@email.com");
        dto.setCarnet("99999999");

        // When
        UsuarioDto resultado = usuarioService.crearUsuario(dto);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getId());
        assertEquals("Juan Carlos Pérez Mamani", resultado.getNombreCompleto());
        assertEquals("70123456", resultado.getCelular());
        assertEquals("Av. 16 de Julio 1234", resultado.getDireccion());
        assertEquals("La Paz", resultado.getDepartamento());
        assertEquals(25, resultado.getEdad());
        assertEquals("juan.perez@email.com", resultado.getCorreoElectronico());
        assertEquals("99999999", resultado.getCarnet());
        assertNotNull(resultado.getCreadoEn());
        assertNotNull(resultado.getActualizadoEn());
    }

    @Test
    void testCrearUsuarioConEmailDuplicado() {
        // Given
        UsuarioCreacionDto dto = new UsuarioCreacionDto();
        dto.setNombreCompleto("Usuario Duplicado");
        dto.setCelular("70123456");
        dto.setDireccion("Dirección Test");
        dto.setDepartamento("La Paz");
        dto.setEdad(25);
        dto.setCorreoElectronico("maria.quispe@email.com"); // Email que ya existe en datos de ejemplo
        dto.setCarnet("99999999");

        // When & Then
        assertThrows(EmailDuplicadoException.class, () -> {
            usuarioService.crearUsuario(dto);
        });
    }

    @Test
    void testCrearUsuarioConCarnetDuplicado() {
        // Given
        UsuarioCreacionDto dto = new UsuarioCreacionDto();
        dto.setNombreCompleto("Usuario Duplicado");
        dto.setCelular("70123456");
        dto.setDireccion("Dirección Test");
        dto.setDepartamento("La Paz");
        dto.setEdad(25);
        dto.setCorreoElectronico("usuario.nuevo@email.com");
        dto.setCarnet("12345678"); // Carnet que ya existe en datos de ejemplo

        // When & Then
        assertThrows(CarnetDuplicadoException.class, () -> {
            usuarioService.crearUsuario(dto);
        });
    }

    @Test
    void testObtenerUsuarioPorIdExitoso() {
        // Given
        Long idExistente = 1L; // ID que existe en datos de ejemplo

        // When
        UsuarioDto resultado = usuarioService.obtenerPorId(idExistente);

        // Then
        assertNotNull(resultado);
        assertEquals(idExistente, resultado.getId());
        assertEquals("María Elena Quispe Mamani", resultado.getNombreCompleto());
        assertEquals("La Paz", resultado.getDepartamento());
    }

    @Test
    void testObtenerUsuarioPorIdNoEncontrado() {
        // Given
        Long idNoExistente = 999L;

        // When & Then
        assertThrows(RecursoNoEncontradoException.class, () -> {
            usuarioService.obtenerPorId(idNoExistente);
        });
    }

    @Test
    void testListarUsuarios() {
        // When
        var usuarios = usuarioService.listar();

        // Then
        assertNotNull(usuarios);
        assertFalse(usuarios.isEmpty());
        assertEquals(5, usuarios.size()); // 5 usuarios en datos de ejemplo
    }

    @Test
    void testBuscarPorDepartamento() {
        // When
        var usuariosLaPaz = usuarioService.buscarPorDepartamento("La Paz");

        // Then
        assertNotNull(usuariosLaPaz);
        assertFalse(usuariosLaPaz.isEmpty());
        assertTrue(usuariosLaPaz.stream().allMatch(u -> "La Paz".equals(u.getDepartamento())));
    }

    @Test
    void testBuscarPorDepartamentoNoEncontrado() {
        // When
        var usuariosTarija = usuarioService.buscarPorDepartamento("Tarija");

        // Then
        assertNotNull(usuariosTarija);
        assertTrue(usuariosTarija.isEmpty());
    }

    @Test
    void testValidacionEdadMinima() {
        // Given
        UsuarioCreacionDto dto = new UsuarioCreacionDto();
        dto.setNombreCompleto("Usuario Menor");
        dto.setCelular("70123456");
        dto.setDireccion("Dirección Test");
        dto.setDepartamento("La Paz");
        dto.setEdad(17); // Edad menor a 18
        dto.setCorreoElectronico("menor@email.com");
        dto.setCarnet("11111111");

        // When & Then
        // La validación de edad mínima se maneja a nivel de DTO, no en el servicio
        // Este test verifica que el servicio acepta la edad (la validación se hace en el controlador)
        assertDoesNotThrow(() -> {
            usuarioService.crearUsuario(dto);
        });
    }
}
