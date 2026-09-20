package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.request.CategoriaRequestDTO;
import com.rutaia.backend.dto.response.CategoriaResponseDTO;
import com.rutaia.backend.mapper.CategoriaMapper;
import com.rutaia.backend.modelo.Categoria;
import com.rutaia.backend.repositorio.CategoriaRepository;
import com.rutaia.backend.service.CategoriaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarTodas() {
        return categoriaRepository.findAll().stream()
                .map(categoriaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaResponseDTO obtenerPorId(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + id));
        return categoriaMapper.toResponseDTO(categoria);
    }

    @Override
    public CategoriaResponseDTO crear(CategoriaRequestDTO requestDTO) {
        Categoria categoria = categoriaMapper.toEntity(requestDTO);
        Categoria categoriaGuardada = categoriaRepository.save(categoria);
        return categoriaMapper.toResponseDTO(categoriaGuardada);
    }

    @Override
    public CategoriaResponseDTO actualizar(Integer id, CategoriaRequestDTO requestDTO) {
        Categoria categoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + id));

        categoriaExistente.setNombre(requestDTO.getNombre());
        Categoria categoriaActualizada = categoriaRepository.save(categoriaExistente);
        return categoriaMapper.toResponseDTO(categoriaActualizada);
    }

    @Override
    public void eliminar(Integer id) {
        if (!categoriaRepository.existsById(id)) {
            throw new EntityNotFoundException("Categoría no encontrada con ID: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
