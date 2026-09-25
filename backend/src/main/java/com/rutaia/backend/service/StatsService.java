package com.rutaia.backend.service;

import com.rutaia.backend.dto.response.StatsResponseDTO;

public interface StatsService {
    StatsResponseDTO obtenerEstadisticas(Integer idUsuario);
}
