package com.votaciones.usuarios.service;

import com.votaciones.usuarios.dto.LoginRequestDto;
import com.votaciones.usuarios.dto.UsuarioDto;
import com.votaciones.usuarios.mapper.UsuarioMapper;
import com.votaciones.usuarios.model.Usuario;
import com.votaciones.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper; // <-- Inyecta el mapper

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public UsuarioDto obtenerPerfilUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuarioMapper.toDto(usuario); // <-- ¡Mapeo automático y limpio!
    }

    public void autenticarUsuario(LoginRequestDto loginRequest) {
        // Lógica de autenticación aquí
    }
    
}
