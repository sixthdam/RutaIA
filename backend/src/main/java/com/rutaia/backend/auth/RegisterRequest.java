package com.rutaia.backend.auth;

import com.rutaia.backend.modelo.enums.ExperienciaEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Formato de correo inválido")
        String correo,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8)
        String contrasenia,

        @NotNull(message = "El nivel de experiencia es obligatorio")
        ExperienciaEnum experiencia,

        String areaInteres
) {}