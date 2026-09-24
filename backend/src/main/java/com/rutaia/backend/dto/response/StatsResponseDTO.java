package com.rutaia.backend.dto.response;

import java.util.Map;
import java.util.List;

public record StatsResponseDTO(
        Long totalConsultas,
        Long consultasRespondidas,
        Long consultasSinResultados,
        Double calificacionPromedio,
        String cursoMasRecomendado,
        Map<String, Long> distribucionEstados,
        List<ConsultaResponseDTO> actividadReciente
) {}
