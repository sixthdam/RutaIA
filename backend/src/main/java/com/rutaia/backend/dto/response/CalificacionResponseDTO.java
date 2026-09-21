package com.rutaia.backend.dto.response;

import lombok.Data;

@Data
public class CalificacionResponseDTO {
    private Integer idRecomendacion;
    private RecomendacionResponseDTO recomendacion; // Objeto anidado de la recomendación calificada
    private Integer calificacion;
}