package com.rutaia.backend.mapper;

import com.rutaia.backend.dto.response.CalificacionResponseDTO;
import com.rutaia.backend.modelo.Calificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
    public class CalificacionMapper {

    private final RecomendacionMapper recomendacionMapper;

    public CalificacionResponseDTO toResponseDTO(Calificacion calificacion) {
        if (calificacion == null) {
            return null;
        }
        CalificacionResponseDTO dto = new CalificacionResponseDTO();
        dto.setIdRecomendacion(calificacion.getIdRecomendacion());
        dto.setRecomendacion(recomendacionMapper.toResponseDTO(calificacion.getRecomendacion()));
        dto.setCalificacion(calificacion.getCalificacion());
        return dto;
    }
}