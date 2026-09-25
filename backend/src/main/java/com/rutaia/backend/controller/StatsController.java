package com.rutaia.backend.controller;

import com.rutaia.backend.dto.response.StatsResponseDTO;
import com.rutaia.backend.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Estadísticas", description = "Métricas generales de la plataforma")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(summary = "Obtener estadísticas",
            description = "Sin parámetros devuelve estadísticas globales. Con userId devuelve solo las de ese usuario.")
    @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas con éxito")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado (cuando se filtra por userId)")
    public ResponseEntity<StatsResponseDTO> obtenerEstadisticas(
            @Parameter(description = "Filtra las estadísticas de un usuario específico")
            @RequestParam(required = false) Integer userId) {
        return ResponseEntity.ok(statsService.obtenerEstadisticas(userId));
    }
}