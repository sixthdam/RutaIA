package com.rutaia.backend.controller;

import com.rutaia.backend.dto.request.CalificacionRequestDTO;
import com.rutaia.backend.dto.response.CalificacionResponseDTO;
import com.rutaia.backend.service.CalificacionService;
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
@RequestMapping("/api/calificaciones")
@RequiredArgsConstructor
@Tag(name = "Calificaciones", description = "Operaciones para calificar las recomendaciones RAG (RF 17)")
public class CalificacionController {

    private final CalificacionService calificacionService;

    @GetMapping
    @Operation(summary = "Listar todas las calificaciones")
    @ApiResponse(responseCode = "200", description = "Lista obtenida con éxito")
    public ResponseEntity<List<CalificacionResponseDTO>> listarTodas() {
        return ResponseEntity.ok(calificacionService.listarTodas());
    }

    @GetMapping("/{idRecomendacion}")
    @Operation(summary = "Obtener calificación por ID de recomendación")
    @ApiResponse(responseCode = "200", description = "Calificación encontrada")
    public ResponseEntity<CalificacionResponseDTO> obtenerPorId(@PathVariable Integer idRecomendacion) {
        return ResponseEntity.ok(calificacionService.obtenerPorId(idRecomendacion));
    }

    @PostMapping
    @Operation(summary = "Registrar una calificación (Valor de 1 a 5)")
    @ApiResponse(responseCode = "201", description = "Calificación registrada con éxito")
    public ResponseEntity<CalificacionResponseDTO> registrar(@Valid @RequestBody CalificacionRequestDTO requestDTO) {
        return new ResponseEntity<>(calificacionService.registrar(requestDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{idRecomendacion}")
    @Operation(summary = "Eliminar una calificación")
    @ApiResponse(responseCode = "204", description = "Calificación eliminada con éxito")
    public ResponseEntity<Void> eliminar(@PathVariable Integer idRecomendacion) {
        calificacionService.eliminar(idRecomendacion);
        return ResponseEntity.noContent().build();
    }
}