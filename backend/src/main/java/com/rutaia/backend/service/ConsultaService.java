package com.rutaia.backend.service;

import com.rutaia.backend.dto.request.ConsultaRequestDTO;
import com.rutaia.backend.dto.response.ConsultaResponseDTO;

import java.util.List;

public interface ConsultaService {
    List<ConsultaResponseDTO> listarTodas();
    ConsultaResponseDTO obtenerPorId(Integer id);
    List<ConsultaResponseDTO> listarPorUsuario(Integer idUsuario);
    ConsultaResponseDTO registrar(ConsultaRequestDTO requestDTO);
    ConsultaResponseDTO actualizarEstado(Integer id, String nuevoEstado);
    void eliminar(Integer id);
}