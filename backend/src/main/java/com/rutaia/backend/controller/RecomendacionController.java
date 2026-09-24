package com.rutaia.backend.controller;

import com.rutaia.backend.dto.request.RecomendacionRequestDTO;
import com.rutaia.backend.dto.response.RecomendacionResponseDTO;
import com.rutaia.backend.service.RecomendacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recomendaciones")
@RequiredArgsConstructor
@Tag(name = "Recomendaciones", description = "Gestión de las respuestas y recomendaciones generadas por el sistema RAG")
public class RecomendacionController {

    private final RecomendacionService recomendacionService;

    @GetMapping
    @Operation(summary = "Listar todas las recomendaciones")
    @ApiResponse(responseCode = "200", description = "Lista obtenida con éxito")
    public ResponseEntity<List<RecomendacionResponseDTO>> listarTodas() {
        return ResponseEntity.ok(recomendacionService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una recomendación por ID")
    @ApiResponse(responseCode = "200", description = "Recomendación encontrada")
    @ApiResponse(responseCode = "404", description = "Recomendación no encontrada")
    public ResponseEntity<RecomendacionResponseDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(recomendacionService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Registrar una recomendación generada")
    @ApiResponse(responseCode = "201", description = "Recomendación registrada con éxito")
    public ResponseEntity<RecomendacionResponseDTO> registrar(@Valid @RequestBody RecomendacionRequestDTO requestDTO) {
        return new ResponseEntity<>(recomendacionService.registrar(requestDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una recomendación")
    @ApiResponse(responseCode = "204", description = "Recomendación eliminada con éxito")
    @ApiResponse(responseCode = "404", description = "Recomendación no encontrada")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        recomendacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}