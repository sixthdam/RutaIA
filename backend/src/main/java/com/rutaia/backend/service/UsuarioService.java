package com.rutaia.backend.service;

import com.rutaia.backend.dto.request.UsuarioRequestDTO;
import com.rutaia.backend.dto.response.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    List<UsuarioResponseDTO> listarTodos();
    UsuarioResponseDTO obtenerPorId(Integer id);
    UsuarioResponseDTO registrar(UsuarioRequestDTO requestDTO);
    UsuarioResponseDTO actualizar(Integer id, UsuarioRequestDTO requestDTO);
    void eliminar(Integer id);
}