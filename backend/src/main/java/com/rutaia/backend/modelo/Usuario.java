package com.rutaia.backend.modelo;

import com.rutaia.backend.modelo.enums.ExperienciaEnum;
import com.rutaia.backend.modelo.enums.RolEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private RolEnum rol;

    @Column(name = "correo", nullable = false, unique = true, length = 255)
    private String correo;

    @Column(name = "contrasenia", nullable = false, length = 255)
    private String contrasenia;

    @Enumerated(EnumType.STRING)
    @Column(name = "experiencia", nullable = false)
    private ExperienciaEnum experiencia;

    @Column(name = "area_interes", length = 255)
    private String areaInteres;
}
