package com.rutaia.backend.service;

import com.rutaia.backend.dto.request.CategoriaRequestDTO;
import com.rutaia.backend.dto.response.CategoriaResponseDTO;

import java.util.List;

public interface CategoriaService {
    List<CategoriaResponseDTO> listarTodas();
    CategoriaResponseDTO obtenerPorId(Integer id);
    CategoriaResponseDTO crear(CategoriaRequestDTO categoriaRequestDTO);
    CategoriaResponseDTO actualizar(Integer id, CategoriaRequestDTO categoriaRequestDTO);
    void eliminar(Integer id);
}