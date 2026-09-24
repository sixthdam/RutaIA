package com.rutaia.backend.dto.response;

import com.rutaia.backend.modelo.enums.ExperienciaEnum;
import com.rutaia.backend.modelo.enums.RolEnum;
import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Integer idUsuario;
    private String nombre;
    private RolEnum rol;
    private String correo;
    private ExperienciaEnum experiencia;
    private String areaInteres;
}