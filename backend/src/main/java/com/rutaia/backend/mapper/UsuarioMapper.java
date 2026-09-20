package com.rutaia.backend.mapper;

import com.rutaia.backend.dto.response.UsuarioResponseDTO;
import com.rutaia.backend.modelo.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setRol(usuario.getRol());
        dto.setCorreo(usuario.getCorreo());
        dto.setExperiencia(usuario.getExperiencia());
        dto.setAreaInteres(usuario.getAreaInteres());
        return dto;
    }
}