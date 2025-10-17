// Ubicación: dto-usuarios/src/main/java/com/votaciones/usuarios/dto/UsuarioDto.java
package com.votaciones;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;

@Schema(name = "Usuario", description = "Información de un usuario del sistema")
@Data
public class UsuarioDto {
    private Long id;
    private String nombreCompleto;
    private String carnet;
    private LocalDate fechaNacimiento;
    private String departamento;
    private String correoElectronico; // Puede ser nulo si no lo ha registrado
    private boolean correoVerificado; // Para saber si ya completó el 2FA
    private Instant creadoEn;
}