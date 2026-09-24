package com.rutaia.backend.controller;

import com.rutaia.backend.modelo.enums.DificultadEnum;
import com.rutaia.backend.modelo.enums.EstadoConsultaEnum;
import com.rutaia.backend.modelo.enums.ExperienciaEnum;
import com.rutaia.backend.modelo.enums.RolEnum;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @SecurityRequirements
    @GetMapping("/dificultades")
    public ResponseEntity<DificultadEnum[]> listarDificultades() {
        return ResponseEntity.ok(DificultadEnum.values());
    }

    @SecurityRequirements
    @GetMapping("/roles")
    public ResponseEntity<RolEnum[]> listarRoles() {
        return ResponseEntity.ok(RolEnum.values());
    }

    @SecurityRequirements
    @GetMapping("/experiencias")
    public ResponseEntity<ExperienciaEnum[]> listarExperiencias() {
        return ResponseEntity.ok(ExperienciaEnum.values());
    }

    @SecurityRequirements
    @GetMapping("/estados")
    public ResponseEntity<EstadoConsultaEnum[]> listarEstados() {
        return ResponseEntity.ok(EstadoConsultaEnum.values());
    }
}