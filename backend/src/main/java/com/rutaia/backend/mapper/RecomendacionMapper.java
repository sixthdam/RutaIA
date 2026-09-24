package com.rutaia.backend.mapper;

import com.rutaia.backend.dto.response.RecomendacionResponseDTO;
import com.rutaia.backend.modelo.Recomendacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecomendacionMapper {

    private final ConsultaMapper consultaMapper;

    public RecomendacionResponseDTO toResponseDTO(Recomendacion recomendacion) {
        if (recomendacion == null) {
            return null;
        }
        RecomendacionResponseDTO dto = new RecomendacionResponseDTO();
        dto.setIdRecomendacion(recomendacion.getIdRecomendacion());
        dto.setConsulta(consultaMapper.toResponseDTO(recomendacion.getConsulta()));
        dto.setRespuesta(recomendacion.getRespuesta());
        dto.setFecha(recomendacion.getFecha());
        return dto;
    }
}