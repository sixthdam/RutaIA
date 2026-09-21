package com.rutaia.backend.dto.response;

import lombok.Data;

@Data
public class FuenteResponseDTO {
    private Integer idRecomendacion;
    private CursoResponseDTO curso; // Objeto completo del curso utilizado como fuente
    private Double similitud;
}