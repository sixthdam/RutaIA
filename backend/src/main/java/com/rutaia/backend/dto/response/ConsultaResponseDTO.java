package com.rutaia.backend.dto.response;

import com.rutaia.backend.modelo.enums.EstadoConsultaEnum;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ConsultaResponseDTO {
    private Integer idConsulta;
    private UsuarioResponseDTO usuario; // Objeto completo del estudiante
    private String pregunta;
    private LocalDate fecha;
    private EstadoConsultaEnum estado;
}