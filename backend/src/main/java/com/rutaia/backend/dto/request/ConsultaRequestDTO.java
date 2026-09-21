package com.rutaia.backend.dto.request;

import com.rutaia.backend.modelo.enums.EstadoConsultaEnum;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ConsultaRequestDTO {
    @NotNull(message = "El usuario es obligatorio")
    private Integer idUsuario;

    @NotBlank(message = "La pregunta no puede estar vacía")
    private String pregunta;

    // La fecha y el estado (ej. PENDIENTE) ya tienen DEFAULT no es necesario llenarlos pero se puede
    private LocalDate fecha;
    private EstadoConsultaEnum estado;
}