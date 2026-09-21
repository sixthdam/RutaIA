package com.rutaia.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RecomendacionRequestDTO {
    @NotNull(message = "La consulta es obligatoria")
    private Integer idConsulta;

    private String respuesta;
    private LocalDate fecha;
}