package com.rutaia.backend.dto.response;

import com.rutaia.backend.modelo.enums.DificultadEnum;
import lombok.Data;

@Data
public class CursoResponseDTO {
    private Integer idCurso;
    private CategoriaResponseDTO categoria;
    private String nombre;
    private String descripcion;
    private DificultadEnum dificultad;
    private Integer duracion;
    private Boolean activo;
}