package main.java.com.votaciones.dto.candidatos;

import java.time.Instant;
import java.time.LocalDate;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de candidatos en el sistema de votaciones bolivianas
 */
@Schema(name = "CandidatoDto", description = "Información de una fórmula de candidatos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatoDto {

    @Schema(description = "ID único de la fórmula", example = "1")
    private Long id;

    @Schema(description = "Nombre del partido político", example = "Movimiento al Socialismo (MAS)")
    private String partido;

    @Schema(description = "Nombre completo del candidato a presidente", example = "Luis Alberto Arce Catacora")
    private String nombreCompletoPresidente;

    @Schema(description = "Nombre completo del candidato a vicepresidente", example = "David Choquehuanca Céspedes")
    private String nombreCompletoVicepresidente;

    @Schema(description = "Carnet de identidad del presidente", example = "1234567")
    private String carnetPresidente;

    @Schema(description = "Carnet de identidad del vicepresidente", example = "7654321")
    private String carnetVicepresidente;

    @Schema(description = "Fecha de nacimiento del presidente", example = "1965-09-28")
    private LocalDate fechaNacimientoPresidente;

    @Schema(description = "Fecha de nacimiento del vicepresidente", example = "1964-06-15")
    private LocalDate fechaNacimientoVicepresidente;

    @Schema(description = "Correo electrónico de contacto", example = "contacto@partidomas.bo")
    private String correoElectronico;

    @Schema(description = "Indica si el correo ha sido verificado", example = "true")
    private boolean correoVerificado;

    @Schema(description = "Descripción de la propuesta electoral", example = "Propuesta enfocada en estabilidad económica y social")
    private String descripcion;

    @Schema(description = "Fecha de creación", example = "2024-01-15T10:30:00Z")
    private Instant creadoEn;

    @Schema(description = "Fecha de última actualización", example = "2024-01-15T10:30:00Z")
    private Instant actualizadoEn;
}
