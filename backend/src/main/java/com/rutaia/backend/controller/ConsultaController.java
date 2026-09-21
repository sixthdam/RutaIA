package com.rutaia.backend.controller;

import com.rutaia.backend.dto.request.ConsultaRequestDTO;
import com.rutaia.backend.dto.response.ConsultaResponseDTO;
import com.rutaia.backend.service.ConsultaService;
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
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
@Tag(name = "Consultas", description = "Operaciones para registrar y consultar las preguntas en lenguaje natural de los estudiantes")
public class ConsultaController {

    private final ConsultaService consultaService;

    @GetMapping
    @Operation(summary = "Listar todas las consultas")
    @ApiResponse(responseCode = "200", description = "Lista obtenida con éxito")
    public ResponseEntity<List<ConsultaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una consulta por ID")
    @ApiResponse(responseCode = "200", description = "Consulta encontrada")
    @ApiResponse(responseCode = "404", description = "Consulta no encontrada")
    public ResponseEntity<ConsultaResponseDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(consultaService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Registrar una nueva consulta de usuario")
    @ApiResponse(responseCode = "201", description = "Consulta registrada con éxito")
    public ResponseEntity<ConsultaResponseDTO> registrar(@Valid @RequestBody ConsultaRequestDTO requestDTO) {
        return new ResponseEntity<>(consultaService.registrar(requestDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una consulta")
    @ApiResponse(responseCode = "204", description = "Consulta eliminada con éxito")
    @ApiResponse(responseCode = "404", description = "Consulta no encontrada")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        consultaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}