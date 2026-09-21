package com.rutaia.backend.service;

import com.rutaia.backend.dto.request.RecomendacionRequestDTO;
import com.rutaia.backend.dto.response.RecomendacionResponseDTO;

import java.util.List;

public interface RecomendacionService {
    List<RecomendacionResponseDTO> listarTodas();
    RecomendacionResponseDTO obtenerPorId(Integer id);
    RecomendacionResponseDTO obtenerPorConsulta(Integer idConsulta);
    RecomendacionResponseDTO registrar(RecomendacionRequestDTO requestDTO);
    RecomendacionResponseDTO actualizar(Integer id, RecomendacionRequestDTO requestDTO);
    void eliminar(Integer id);
}