package com.rutaia.backend.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RecomendacionResponseDTO {
    private Integer idRecomendacion;
    private ConsultaResponseDTO consulta; // Objeto completo anidado
    private String respuesta;
    private LocalDate fecha;
}