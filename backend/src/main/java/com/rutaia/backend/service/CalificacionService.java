package com.rutaia.backend.service;

import com.rutaia.backend.dto.request.CalificacionRequestDTO;
import com.rutaia.backend.dto.response.CalificacionResponseDTO;

import java.util.List;

public interface CalificacionService {
    List<CalificacionResponseDTO> listarTodas();
    CalificacionResponseDTO obtenerPorId(Integer idRecomendacion);
    CalificacionResponseDTO registrar(CalificacionRequestDTO requestDTO);
    void eliminar(Integer idRecomendacion);
}