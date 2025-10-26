package com.votaciones.usuarios.repository;

import com.votaciones.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Spring Data JPA creará automáticamente la consulta para buscar un usuario por su carnet
    Optional<Usuario> findByCarnet(String carnet);

    // También puedes necesitar buscar por correo
    Optional<Usuario> findByCorreoElectronico(String correoElectronico);
}
