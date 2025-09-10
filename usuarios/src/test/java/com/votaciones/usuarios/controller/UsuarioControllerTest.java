package com.votaciones.usuarios.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.votaciones.usuarios.dto.UsuarioCreacionDto;
import com.votaciones.usuarios.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests unitarios para el controlador de usuarios
 */
@WebMvcTest(UsuarioController.class)
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    private UsuarioCreacionDto usuarioCreacionDto;
    private com.votaciones.usuarios.dto.UsuarioDto usuarioDto;

    @BeforeEach
    void setUp() {
        // Configurar DTO de creación
        usuarioCreacionDto = new UsuarioCreacionDto();
        usuarioCreacionDto.setNombreCompleto("Juan Carlos Pérez Mamani");
        usuarioCreacionDto.setCelular("70123456");
        usuarioCreacionDto.setDireccion("Av. 16 de Julio 1234");
        usuarioCreacionDto.setDepartamento("La Paz");
        usuarioCreacionDto.setEdad(25);
        usuarioCreacionDto.setCorreoElectronico("juan.perez@email.com");
        usuarioCreacionDto.setCarnet("12345678");

        // Configurar DTO de respuesta
        usuarioDto = new com.votaciones.usuarios.dto.UsuarioDto();
        usuarioDto.setId(1L);
        usuarioDto.setNombreCompleto("Juan Carlos Pérez Mamani");
        usuarioDto.setCelular("70123456");
        usuarioDto.setDireccion("Av. 16 de Julio 1234");
        usuarioDto.setDepartamento("La Paz");
        usuarioDto.setEdad(25);
        usuarioDto.setCorreoElectronico("juan.perez@email.com");
        usuarioDto.setCarnet("12345678");
    }

    @Test
    void testCrearUsuarioExitoso() throws Exception {
        // Given
        when(usuarioService.crearUsuario(any(UsuarioCreacionDto.class))).thenReturn(usuarioDto);

        // When & Then
        mockMvc.perform(post("/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioCreacionDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombreCompleto").value("Juan Carlos Pérez Mamani"))
                .andExpect(jsonPath("$.celular").value("70123456"))
                .andExpect(jsonPath("$.direccion").value("Av. 16 de Julio 1234"))
                .andExpect(jsonPath("$.departamento").value("La Paz"))
                .andExpect(jsonPath("$.edad").value(25))
                .andExpect(jsonPath("$.correoElectronico").value("juan.perez@email.com"))
                .andExpect(jsonPath("$.carnet").value("12345678"));
    }

    @Test
    void testCrearUsuarioConDatosInvalidos() throws Exception {
        // Given
        UsuarioCreacionDto dtoInvalido = new UsuarioCreacionDto();
        dtoInvalido.setNombreCompleto(""); // Nombre vacío
        dtoInvalido.setEdad(17); // Edad menor a 18
        dtoInvalido.setCorreoElectronico("email-invalido"); // Email inválido

        // When & Then
        mockMvc.perform(post("/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoInvalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testObtenerUsuarioPorIdExitoso() throws Exception {
        // Given
        when(usuarioService.obtenerPorId(1L)).thenReturn(usuarioDto);

        // When & Then
        mockMvc.perform(get("/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombreCompleto").value("Juan Carlos Pérez Mamani"))
                .andExpect(jsonPath("$.departamento").value("La Paz"));
    }

    @Test
    void testObtenerUsuarioPorIdNoEncontrado() throws Exception {
        // Given
        when(usuarioService.obtenerPorId(999L))
                .thenThrow(new com.votaciones.usuarios.exception.RecursoNoEncontradoException("Usuario", 999L));

        // When & Then
        mockMvc.perform(get("/usuarios/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Recurso no encontrado"));
    }

    @Test
    void testListarUsuarios() throws Exception {
        // Given
        List<com.votaciones.usuarios.dto.UsuarioDto> usuarios = Arrays.asList(usuarioDto);
        when(usuarioService.listar()).thenReturn(usuarios);

        // When & Then
        mockMvc.perform(get("/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nombreCompleto").value("Juan Carlos Pérez Mamani"));
    }

    @Test
    void testBuscarPorDepartamento() throws Exception {
        // Given
        List<com.votaciones.usuarios.dto.UsuarioDto> usuarios = Arrays.asList(usuarioDto);
        when(usuarioService.buscarPorDepartamento("La Paz")).thenReturn(usuarios);

        // When & Then
        mockMvc.perform(get("/usuarios/departamento/La Paz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].departamento").value("La Paz"));
    }

    @Test
    void testCrearUsuarioConEmailDuplicado() throws Exception {
        // Given
        when(usuarioService.crearUsuario(any(UsuarioCreacionDto.class)))
                .thenThrow(new com.votaciones.usuarios.exception.EmailDuplicadoException("juan.perez@email.com"));

        // When & Then
        mockMvc.perform(post("/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioCreacionDto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflicto de datos"));
    }
}

