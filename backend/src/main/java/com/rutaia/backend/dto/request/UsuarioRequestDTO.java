package com.rutaia.backend.dto.request;

import com.rutaia.backend.modelo.enums.ExperienciaEnum;
import com.rutaia.backend.modelo.enums.RolEnum;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UsuarioRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotNull(message = "El rol es obligatorio")
    private RolEnum rol;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Formato de correo inválido")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasenia;

    @NotNull(message = "El nivel de experiencia es obligatorio")
    private ExperienciaEnum experiencia;

    private String areaInteres;
}