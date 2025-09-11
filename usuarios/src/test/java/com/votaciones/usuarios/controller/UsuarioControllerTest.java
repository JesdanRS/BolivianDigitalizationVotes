package com.votaciones.usuarios.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.votaciones.usuarios.dto.UsuarioCreacionDto;
import com.votaciones.usuarios.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
// Eliminados imports de MockMvc; usamos WebTestClient

/**
 * Tests unitarios para el controlador de usuarios sin cargar el contexto de Spring
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UsuarioControllerTest {

	@LocalServerPort
	private int port;
	@Autowired
	private WebTestClient webTestClient;

	@MockBean
	private UsuarioService usuarioService;

	private ObjectMapper objectMapper;


	private UsuarioCreacionDto usuarioCreacionDto;
	private com.votaciones.usuarios.dto.UsuarioDto usuarioDto;

	@BeforeEach
	void setUp() {
		objectMapper = new ObjectMapper();

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
		when(usuarioService.crearUsuario(any(UsuarioCreacionDto.class))).thenReturn(usuarioDto);

		webTestClient.post().uri("/usuarios")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(objectMapper.writeValueAsString(usuarioCreacionDto))
			.exchange()
			.expectStatus().isCreated()
			.expectBody()
			.jsonPath("$.id").isEqualTo(1)
			.jsonPath("$.nombreCompleto").isEqualTo("Juan Carlos Pérez Mamani")
			.jsonPath("$.celular").isEqualTo("70123456")
			.jsonPath("$.direccion").isEqualTo("Av. 16 de Julio 1234")
			.jsonPath("$.departamento").isEqualTo("La Paz")
			.jsonPath("$.edad").isEqualTo(25)
			.jsonPath("$.correoElectronico").isEqualTo("juan.perez@email.com")
			.jsonPath("$.carnet").isEqualTo("12345678");
	}

	@Test
	void testCrearUsuarioConDatosInvalidos() throws Exception {
		UsuarioCreacionDto dtoInvalido = new UsuarioCreacionDto();
		dtoInvalido.setNombreCompleto("");
		dtoInvalido.setEdad(17);
		dtoInvalido.setCorreoElectronico("email-invalido");

		webTestClient.post().uri("/usuarios")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(objectMapper.writeValueAsString(dtoInvalido))
			.exchange()
			.expectStatus().isBadRequest();
	}

	@Test
	void testObtenerUsuarioPorIdExitoso() throws Exception {
		when(usuarioService.obtenerPorId(1L)).thenReturn(usuarioDto);

		webTestClient.get().uri("/usuarios/1")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$.id").isEqualTo(1)
			.jsonPath("$.nombreCompleto").isEqualTo("Juan Carlos Pérez Mamani")
			.jsonPath("$.departamento").isEqualTo("La Paz");
	}

	@Test
	void testObtenerUsuarioPorIdNoEncontrado() throws Exception {
		when(usuarioService.obtenerPorId(999L))
			.thenThrow(new com.votaciones.usuarios.exception.RecursoNoEncontradoException("Usuario", 999L));

		webTestClient.get().uri("/usuarios/999")
			.exchange()
			.expectStatus().isNotFound()
			.expectBody()
			.jsonPath("$.status").isEqualTo(404)
			.jsonPath("$.error").isEqualTo("Recurso no encontrado");
	}

	@Test
	void testListarUsuarios() throws Exception {
		List<com.votaciones.usuarios.dto.UsuarioDto> usuarios = Arrays.asList(usuarioDto);
		when(usuarioService.listar()).thenReturn(usuarios);

		webTestClient.get().uri("/usuarios")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].id").isEqualTo(1)
			.jsonPath("$[0].nombreCompleto").isEqualTo("Juan Carlos Pérez Mamani");
	}

	@Test
	void testBuscarPorDepartamento() throws Exception {
		List<com.votaciones.usuarios.dto.UsuarioDto> usuarios = Arrays.asList(usuarioDto);
		when(usuarioService.buscarPorDepartamento("La Paz")).thenReturn(usuarios);

		webTestClient.get().uri("/usuarios/departamento/La Paz")
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$").isArray()
			.jsonPath("$[0].departamento").isEqualTo("La Paz");
	}

	@Test
	void testCrearUsuarioConEmailDuplicado() throws Exception {
		when(usuarioService.crearUsuario(any(UsuarioCreacionDto.class)))
			.thenThrow(new com.votaciones.usuarios.exception.EmailDuplicadoException("juan.perez@email.com"));

		webTestClient.post().uri("/usuarios")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(objectMapper.writeValueAsString(usuarioCreacionDto))
			.exchange()
			.expectStatus().isEqualTo(org.springframework.http.HttpStatus.CONFLICT)
			.expectBody()
			.jsonPath("$.status").isEqualTo(409)
			.jsonPath("$.error").isEqualTo("Conflicto de datos");
	}
}

