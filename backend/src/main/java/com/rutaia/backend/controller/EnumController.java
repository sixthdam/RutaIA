package com.rutaia.backend.controller;

import com.rutaia.backend.modelo.enums.DificultadEnum;
import com.rutaia.backend.modelo.enums.ExperienciaEnum;
import com.rutaia.backend.modelo.enums.RolEnum;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @GetMapping("/dificultades")
    public ResponseEntity<DificultadEnum[]> listarDificultades() {
        return ResponseEntity.ok(DificultadEnum.values());
    }
    @GetMapping("/roles")
    public ResponseEntity<RolEnum[]> listarRoles() {
        return ResponseEntity.ok(RolEnum.values());
    }

    @GetMapping("/experiencias")
    public ResponseEntity<ExperienciaEnum[]> listarExperiencias() {
        return ResponseEntity.ok(ExperienciaEnum.values());
    }
}