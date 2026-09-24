package com.rutaia.backend.dto.request;

import com.rutaia.backend.modelo.enums.DificultadEnum;
import lombok.Data;

import jakarta.validation.constraints.*;

@Data
public class CursoRequestDTO {
    @NotNull(message = "La categoría es obligatoria")
    private Integer idCategoria;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "La dificultad es obligatoria")
    private DificultadEnum dificultad;

    @NotNull(message = "La duración es obligatoria")
    @Positive(message = "La duración debe ser mayor a 0")
    private Integer duracion;

    private Boolean activo;
}