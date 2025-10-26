package com.votaciones.usuarios.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.time.LocalDate;


@Entity
@Table(name = "usuarios")
@Data

public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombreCompleto;

    @Column(nullable = false, unique = true, length = 20)
    private String carnet;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false, length = 50)
    private String departamento;

    @Column(unique = true, length = 150) // Puede ser nulo al principio
    private String correoElectronico;

    @Column(nullable = false)
    private boolean correoVerificado = false; // Por defecto, el correo no está verificado

    @CreationTimestamp // Hibernate asigna la fecha de creación automáticamente
    private Instant creadoEn;

    @Column(length = 6) // El código tendrá 6 dígitos
    private String codigoVerificacion;

    private Instant codigoExpiracion;
}
