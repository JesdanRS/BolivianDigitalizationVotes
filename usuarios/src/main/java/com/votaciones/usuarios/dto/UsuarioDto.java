package com.votaciones.usuarios.dto;

import com.votaciones.usuarios.model.Usuario;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

/**
 * DTO para la respuesta de usuarios en el sistema de votaciones bolivianas
 */
@Schema(name = "Usuario", description = "Información de un usuario")
public class UsuarioDto {

    @Schema(description = "ID único del usuario", example = "1")
    private Long id;

    @Schema(description = "Nombre completo del usuario", example = "Juan Carlos Pérez Mamani")
    private String nombreCompleto;

    @Schema(description = "Número de celular", example = "70123456")
    private String celular;

    @Schema(description = "Dirección de residencia", example = "Av. 16 de Julio 1234")
    private String direccion;

    @Schema(description = "Departamento de residencia", example = "La Paz")
    private String departamento;

    @Schema(description = "Edad del usuario", example = "25")
    private int edad;

    @Schema(description = "Correo electrónico", example = "juan.perez@email.com")
    private String correoElectronico;

    @Schema(description = "Número de carnet de identidad", example = "12345678")
    private String carnet;

    @Schema(description = "Fecha de creación", example = "2024-01-15T10:30:00Z")
    private Instant creadoEn;

    @Schema(description = "Fecha de última actualización", example = "2024-01-15T10:30:00Z")
    private Instant actualizadoEn;

    public UsuarioDto() {
    }

    public UsuarioDto(Long id, String nombreCompleto, String celular, String direccion, 
                      String departamento, int edad, String correoElectronico, String carnet,
                      Instant creadoEn, Instant actualizadoEn) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.celular = celular;
        this.direccion = direccion;
        this.departamento = departamento;
        this.edad = edad;
        this.correoElectronico = correoElectronico;
        this.carnet = carnet;
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;
    }

    public static UsuarioDto fromUsuario(Usuario usuario) {
        return new UsuarioDto(
            usuario.getId(),
            usuario.getNombreCompleto(),
            usuario.getCelular(),
            usuario.getDireccion(),
            usuario.getDepartamento(),
            usuario.getEdad(),
            usuario.getCorreoElectronico(),
            usuario.getCarnet(),
            usuario.getCreadoEn(),
            usuario.getActualizadoEn()
        );
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getCarnet() {
        return carnet;
    }

    public void setCarnet(String carnet) {
        this.carnet = carnet;
    }

    public Instant getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(Instant creadoEn) {
        this.creadoEn = creadoEn;
    }

    public Instant getActualizadoEn() {
        return actualizadoEn;
    }

    public void setActualizadoEn(Instant actualizadoEn) {
        this.actualizadoEn = actualizadoEn;
    }
}

