package com.rutaia.backend.controller;

import com.rutaia.backend.dto.request.RecomendacionRequestDTO;
import com.rutaia.backend.dto.response.RecomendacionResponseDTO;
import com.rutaia.backend.service.RecomendacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recomendaciones")
@RequiredArgsConstructor
public class RecomendacionController {

    private final RecomendacionService recomendacionService;

    @GetMapping
    public ResponseEntity<List<RecomendacionResponseDTO>> listarTodas() {
        return ResponseEntity.ok(recomendacionService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecomendacionResponseDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(recomendacionService.obtenerPorId(id));
    }

    @GetMapping("/consulta/{idConsulta}")
    public ResponseEntity<RecomendacionResponseDTO> obtenerPorConsulta(@PathVariable Integer idConsulta) {
        return ResponseEntity.ok(recomendacionService.obtenerPorConsulta(idConsulta));
    }

    @PostMapping
    public ResponseEntity<RecomendacionResponseDTO> registrar(@Valid @RequestBody RecomendacionRequestDTO requestDTO) {
        return new ResponseEntity<>(recomendacionService.registrar(requestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecomendacionResponseDTO> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody RecomendacionRequestDTO requestDTO) {
        return ResponseEntity.ok(recomendacionService.actualizar(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        recomendacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}