package com.rutaia.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CalificacionRequestDTO {
    @NotNull(message = "La recomendación es obligatoria")
    private Integer idRecomendacion;

    @NotNull(message = "La calificación es obligatoria")
    @Min(value = 1, message = "La calificación mínima es 1")
    @Max(value = 5, message = "La calificación máxima es 5")
    private Integer calificacion;
}