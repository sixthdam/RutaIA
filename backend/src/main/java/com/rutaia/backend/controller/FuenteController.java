package com.rutaia.backend.controller;

import com.rutaia.backend.dto.request.FuenteRequestDTO;
import com.rutaia.backend.dto.response.FuenteResponseDTO;
import com.rutaia.backend.service.FuenteService;
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
@RequestMapping("/api/fuentes")
@RequiredArgsConstructor
@Tag(name = "Fuentes", description = "Operaciones de fuentes y cursos utilizados en las recomendaciones RAG")
public class FuenteController {

    private final FuenteService fuenteService;

    @GetMapping
    @Operation(summary = "Listar todas las fuentes")
    @ApiResponse(responseCode = "200", description = "Lista obtenida con éxito")
    public ResponseEntity<List<FuenteResponseDTO>> listarTodas() {
        return ResponseEntity.ok(fuenteService.listarTodas());
    }

    @GetMapping("/recomendacion/{idRecomendacion}")
    @Operation(summary = "Listar fuentes por ID de recomendación")
    @ApiResponse(responseCode = "200", description = "Fuentes encontradas")
    public ResponseEntity<List<FuenteResponseDTO>> listarPorRecomendacion(@PathVariable Integer idRecomendacion) {
        return ResponseEntity.ok(fuenteService.listarPorRecomendacion(idRecomendacion));
    }

    @PostMapping
    @Operation(summary = "Registrar una nueva fuente asociada a una recomendación")
    @ApiResponse(responseCode = "201", description = "Fuente registrada con éxito")
    public ResponseEntity<FuenteResponseDTO> registrar(@Valid @RequestBody FuenteRequestDTO requestDTO) {
        return new ResponseEntity<>(fuenteService.registrar(requestDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{idRecomendacion}/{idCurso}")
    @Operation(summary = "Eliminar una fuente por clave compuesta")
    @ApiResponse(responseCode = "204", description = "Fuente eliminada con éxito")
    public ResponseEntity<Void> eliminar(@PathVariable Integer idRecomendacion, @PathVariable Integer idCurso) {
        fuenteService.eliminar(idRecomendacion, idCurso);
        return ResponseEntity.noContent().build();
    }
}