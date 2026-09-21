package com.rutaia.backend.service;

import com.rutaia.backend.dto.request.CursoRequestDTO;
import com.rutaia.backend.dto.response.CursoResponseDTO;

import java.util.List;

public interface CursoService {
    List<CursoResponseDTO> listarTodos();
    CursoResponseDTO obtenerPorId(Integer id);
    CursoResponseDTO crear(CursoRequestDTO requestDTO);
    CursoResponseDTO actualizar(Integer id, CursoRequestDTO requestDTO);
    void eliminar(Integer id);
}
