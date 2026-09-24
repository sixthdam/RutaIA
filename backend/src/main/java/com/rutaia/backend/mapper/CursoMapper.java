package com.rutaia.backend.mapper;

import com.rutaia.backend.dto.response.CursoResponseDTO;
import com.rutaia.backend.modelo.Curso;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CursoMapper {

    private final CategoriaMapper categoriaMapper;

    public CursoResponseDTO toResponseDTO(Curso curso) {
        if (curso == null) {
            return null;
        }
        CursoResponseDTO dto = new CursoResponseDTO();
        dto.setIdCurso(curso.getIdCurso());
        dto.setCategoria(categoriaMapper.toResponseDTO(curso.getCategoria()));
        dto.setNombre(curso.getNombre());
        dto.setDescripcion(curso.getDescripcion());
        dto.setDificultad(curso.getDificultad());
        dto.setDuracion(curso.getDuracion());
        dto.setActivo(curso.getActivo());
        return dto;
    }
}