package com.rutaia.backend.controller;

import com.rutaia.backend.dto.request.ConsultaRequestDTO;
import com.rutaia.backend.dto.response.ConsultaResponseDTO;
import com.rutaia.backend.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @GetMapping
    public ResponseEntity<List<ConsultaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(consultaService.obtenerPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ConsultaResponseDTO>> listarPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(consultaService.listarPorUsuario(idUsuario));
    }

    @PostMapping
    public ResponseEntity<ConsultaResponseDTO> registrar(@Valid @RequestBody ConsultaRequestDTO requestDTO) {
        return new ResponseEntity<>(consultaService.registrar(requestDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        consultaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}