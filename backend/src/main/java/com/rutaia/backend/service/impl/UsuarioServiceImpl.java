package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.request.UsuarioRequestDTO;
import com.rutaia.backend.dto.response.UsuarioResponseDTO;
import com.rutaia.backend.mapper.UsuarioMapper;
import com.rutaia.backend.modelo.Usuario;
import com.rutaia.backend.repositorio.UsuarioRepository;
import com.rutaia.backend.service.UsuarioService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(usuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDTO obtenerPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + id));
        return usuarioMapper.toResponseDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO registrar(UsuarioRequestDTO requestDTO) {
        // Regla de negocio: Impedir correos duplicados
        if (usuarioRepository.existsByCorreo(requestDTO.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el correo: " + requestDTO.getCorreo());
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(requestDTO.getNombre());
        usuario.setRol(requestDTO.getRol());
        usuario.setCorreo(requestDTO.getCorreo());
        // Nota: En un proyecto con seguridad real aquí se encriptaría la contraseña con BCrypt
        usuario.setContrasenia(requestDTO.getContrasenia());
        usuario.setExperiencia(requestDTO.getExperiencia());
        usuario.setAreaInteres(requestDTO.getAreaInteres());

        return usuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponseDTO actualizar(Integer id, UsuarioRequestDTO requestDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + id));

        // Si cambia el correo, validamos que no pertenezca a otro usuario
        if (!usuarioExistente.getCorreo().equals(requestDTO.getCorreo())
                && usuarioRepository.existsByCorreo(requestDTO.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está en uso por otro usuario.");
        }

        usuarioExistente.setNombre(requestDTO.getNombre());
        usuarioExistente.setRol(requestDTO.getRol());
        usuarioExistente.setCorreo(requestDTO.getCorreo());
        usuarioExistente.setContrasenia(requestDTO.getContrasenia());
        usuarioExistente.setExperiencia(requestDTO.getExperiencia());
        usuarioExistente.setAreaInteres(requestDTO.getAreaInteres());

        return usuarioMapper.toResponseDTO(usuarioRepository.save(usuarioExistente));
    }

    @Override
    public void eliminar(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}
