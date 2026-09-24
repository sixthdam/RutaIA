package com.rutaia.backend.controller;

import com.rutaia.backend.dto.response.StatsResponseDTO;
import com.rutaia.backend.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Estadísticas", description = "Métricas generales de la plataforma")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(summary = "Obtener estadísticas generales")
    @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas con éxito")
    public ResponseEntity<StatsResponseDTO> obtenerEstadisticas() {
        return ResponseEntity.ok(statsService.obtenerEstadisticas());
    }
}