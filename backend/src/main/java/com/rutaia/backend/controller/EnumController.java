package com.rutaia.backend.controller;

import com.rutaia.backend.modelo.enums.DificultadEnum;
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
}