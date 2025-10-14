package com.votaciones.usuarios.service;

import com.votaciones.usuarios.dto.UsuarioCreacionDto;
import com.votaciones.usuarios.dto.UsuarioDto;
import com.votaciones.usuarios.exception.CarnetDuplicadoException;
import com.votaciones.usuarios.exception.EmailDuplicadoException;
import com.votaciones.usuarios.exception.RecursoNoEncontradoException;
import com.votaciones.usuarios.model.Usuario;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Servicio para la gestión de usuarios en el sistema de votaciones bolivianas
 */
@Service
public class UsuarioService {

    private final List<Usuario> usuarios = new ArrayList<>();
    private final AtomicLong contadorId = new AtomicLong(1);

    public UsuarioService() {
        // Inicializar con datos hardcodeados de ejemplo
        inicializarDatosEjemplo();
    }

    /**
     * Crea un nuevo usuario
     */
    public UsuarioDto crearUsuario(UsuarioCreacionDto dto) {
        // Validar email único
        if (existeEmail(dto.getCorreoElectronico())) {
            throw new EmailDuplicadoException(dto.getCorreoElectronico());
        }

        // Validar carnet único
        if (existeCarnet(dto.getCarnet())) {
            throw new CarnetDuplicadoException(dto.getCarnet());
        }

        Usuario usuario = new Usuario(
            dto.getNombreCompleto(),
            dto.getCelular(),
            dto.getDireccion(),
            dto.getDepartamento(),
            dto.getEdad(),
            dto.getCorreoElectronico(),
            dto.getCarnet()
        );

        usuario.setId(contadorId.getAndIncrement());
        usuario.prePersist();
        usuarios.add(usuario);

        return UsuarioDto.fromUsuario(usuario);
    }

    /**
     * Obtiene un usuario por su ID
     */
    public UsuarioDto obtenerPorId(Long id) {
        Usuario usuario = usuarios.stream()
            .filter(u -> u.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));

        return UsuarioDto.fromUsuario(usuario);
    }

    /**
     * Lista todos los usuarios
     */
    public List<UsuarioDto> listar() {
        return usuarios.stream()
            .map(UsuarioDto::fromUsuario)
            .toList();
    }

    /**
     * Busca usuarios por departamento
     */
    public List<UsuarioDto> buscarPorDepartamento(String departamento) {
        return usuarios.stream()
            .filter(u -> u.getDepartamento().equalsIgnoreCase(departamento))
            .map(UsuarioDto::fromUsuario)
            .toList();
    }

    /**
     * Verifica si existe un email
     */
    private boolean existeEmail(String email) {
        return usuarios.stream()
            .anyMatch(u -> u.getCorreoElectronico().equalsIgnoreCase(email));
    }

    /**
     * Verifica si existe un carnet
     */
    private boolean existeCarnet(String carnet) {
        return usuarios.stream()
            .anyMatch(u -> u.getCarnet().equals(carnet));
    }

    /**
     * Inicializa datos de ejemplo para el sistema de votaciones bolivianas
     */
    private void inicializarDatosEjemplo() {
        // Usuario 1 - La Paz
        Usuario usuario1 = new Usuario(
            "María Elena Quispe Mamani",
            "70123456",
            "Av. 16 de Julio 1234, Zona Central",
            "La Paz",
            28,
            "maria.quispe@email.com",
            "12345678"
        );
        usuario1.setId(contadorId.getAndIncrement());
        usuario1.prePersist();
        usuarios.add(usuario1);

        // Usuario 2 - Santa Cruz
        Usuario usuario2 = new Usuario(
            "Carlos Alberto Rojas Vargas",
            "67890123",
            "Calle Beni 567, Barrio Equipetrol",
            "Santa Cruz",
            35,
            "carlos.rojas@email.com",
            "87654321"
        );
        usuario2.setId(contadorId.getAndIncrement());
        usuario2.prePersist();
        usuarios.add(usuario2);

        // Usuario 3 - Cochabamba
        Usuario usuario3 = new Usuario(
            "Ana Patricia Flores Condori",
            "61234567",
            "Av. Heroínas 890, Zona Norte",
            "Cochabamba",
            42,
            "ana.flores@email.com",
            "11223344"
        );
        usuario3.setId(contadorId.getAndIncrement());
        usuario3.prePersist();
        usuarios.add(usuario3);

        // Usuario 4 - Oruro
        Usuario usuario4 = new Usuario(
            "Roberto Carlos Mamani Quispe",
            "64567890",
            "Calle Adolfo Mier 234, Centro",
            "Oruro",
            31,
            "roberto.mamani@email.com",
            "55667788"
        );
        usuario4.setId(contadorId.getAndIncrement());
        usuario4.prePersist();
        usuarios.add(usuario4);

        // Usuario 5 - Potosí
        Usuario usuario5 = new Usuario(
            "Elena Beatriz Choque Huanca",
            "67890123",
            "Av. Villazón 456, Zona Sur",
            "Potosí",
            26,
            "elena.choque@email.com",
            "99887766"
        );
        usuario5.setId(contadorId.getAndIncrement());
        usuario5.prePersist();
        usuarios.add(usuario5);
    }
}

