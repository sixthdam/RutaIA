package com.rutaia.backend.service;

import com.rutaia.backend.dto.request.FuenteRequestDTO;
import com.rutaia.backend.dto.response.FuenteResponseDTO;

import java.util.List;

public interface FuenteService {
    List<FuenteResponseDTO> listarTodas();
    List<FuenteResponseDTO> listarPorRecomendacion(Integer idRecomendacion);
    FuenteResponseDTO registrar(FuenteRequestDTO requestDTO);
    void eliminar(Integer idRecomendacion, Integer idCurso);
}