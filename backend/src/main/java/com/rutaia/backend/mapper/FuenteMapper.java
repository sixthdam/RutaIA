package com.rutaia.backend.mapper;

import com.rutaia.backend.dto.response.FuenteResponseDTO;
import com.rutaia.backend.modelo.Fuente;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FuenteMapper {

    private final CursoMapper cursoMapper;

    public FuenteResponseDTO toResponseDTO(Fuente fuente) {
        if (fuente == null) {
            return null;
        }
        FuenteResponseDTO dto = new FuenteResponseDTO();
        dto.setIdRecomendacion(fuente.getRecomendacion().getIdRecomendacion());
        dto.setCurso(cursoMapper.toResponseDTO(fuente.getCurso()));
        dto.setSimilitud(fuente.getSimilitud());
        return dto;
    }
}