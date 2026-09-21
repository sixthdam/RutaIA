package com.rutaia.backend.controller;

import com.rutaia.backend.dto.request.CursoRequestDTO;
import com.rutaia.backend.dto.response.CursoResponseDTO;
import com.rutaia.backend.service.CursoService;
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
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
@Tag(name = "Cursos", description = "Operaciones para la gestión de cursos (base para embeddings y RAG)")
public class CursoController {

    private final CursoService cursoService;

    @GetMapping
    @Operation(summary = "Listar todos los cursos")
    @ApiResponse(responseCode = "200", description = "Lista de cursos obtenida con éxito")
    public ResponseEntity<List<CursoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(cursoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un curso por ID")
    @ApiResponse(responseCode = "200", description = "Curso encontrado")
    @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    public ResponseEntity<CursoResponseDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(cursoService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Registrar un nuevo curso")
    @ApiResponse(responseCode = "201", description = "Curso registrado con éxito")
    public ResponseEntity<CursoResponseDTO> registrar(@Valid @RequestBody CursoRequestDTO requestDTO) {
        return new ResponseEntity<>(cursoService.crear(requestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un curso existente")
    @ApiResponse(responseCode = "200", description = "Curso actualizado con éxito")
    @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    public ResponseEntity<CursoResponseDTO> actualizar(@PathVariable Integer id, @Valid @RequestBody CursoRequestDTO requestDTO) {
        return ResponseEntity.ok(cursoService.actualizar(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar lógicamente o físicamente un curso")
    @ApiResponse(responseCode = "204", description = "Curso eliminado con éxito")
    @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        cursoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}