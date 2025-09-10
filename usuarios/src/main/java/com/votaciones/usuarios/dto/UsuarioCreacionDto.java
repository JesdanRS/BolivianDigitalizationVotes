package com.votaciones.usuarios.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

/**
 * DTO para la creación de usuarios en el sistema de votaciones bolivianas
 */
@Schema(name = "UsuarioCreacion", description = "Datos para crear un usuario nuevo")
public class UsuarioCreacionDto {

    @Schema(description = "Nombre completo del usuario", example = "Juan Carlos Pérez Mamani", maxLength = 100, required = true)
    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(max = 100, message = "El nombre completo no puede exceder 100 caracteres")
    private String nombreCompleto;

    @Schema(description = "Número de celular", example = "70123456", maxLength = 15, required = true)
    @NotBlank(message = "El celular es obligatorio")
    @Size(max = 15, message = "El celular no puede exceder 15 caracteres")
    private String celular;

    @Schema(description = "Dirección de residencia", example = "Av. 16 de Julio 1234", maxLength = 150, required = true)
    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 150, message = "La dirección no puede exceder 150 caracteres")
    private String direccion;

    @Schema(description = "Departamento de residencia", example = "La Paz", maxLength = 50, required = true)
    @NotBlank(message = "El departamento es obligatorio")
    @Size(max = 50, message = "El departamento no puede exceder 50 caracteres")
    private String departamento;

    @Schema(description = "Edad del usuario", example = "25", minimum = "18", required = true)
    @NotNull(message = "La edad es obligatoria")
    @Min(value = 18, message = "La edad mínima es 18 años")
    private int edad;

    @Schema(description = "Correo electrónico único", example = "juan.perez@email.com", maxLength = 150, required = true)
    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El formato del correo electrónico no es válido")
    @Size(max = 150, message = "El correo electrónico no puede exceder 150 caracteres")
    private String correoElectronico;

    @Schema(description = "Número de carnet de identidad", example = "12345678", maxLength = 20, required = true)
    @NotBlank(message = "El carnet es obligatorio")
    @Size(max = 20, message = "El carnet no puede exceder 20 caracteres")
    private String carnet;

    public UsuarioCreacionDto() {
    }

    public UsuarioCreacionDto(String nombreCompleto, String celular, String direccion, 
                              String departamento, int edad, String correoElectronico, String carnet) {
        this.nombreCompleto = nombreCompleto;
        this.celular = celular;
        this.direccion = direccion;
        this.departamento = departamento;
        this.edad = edad;
        this.correoElectronico = correoElectronico;
        this.carnet = carnet;
    }

    // Getters y Setters
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
}

