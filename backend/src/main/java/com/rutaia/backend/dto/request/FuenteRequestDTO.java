package com.rutaia.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FuenteRequestDTO {
    @NotNull(message = "La recomendación es obligatoria")
    private Integer idRecomendacion;

    @NotNull(message = "El curso es obligatorio")
    private Integer idCurso;

    @NotNull(message = "La similitud es obligatoria")
    private Double similitud;
}