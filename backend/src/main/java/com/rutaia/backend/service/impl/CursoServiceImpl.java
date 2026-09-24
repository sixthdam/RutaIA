package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.request.CursoRequestDTO;
import com.rutaia.backend.dto.response.CursoResponseDTO;
import com.rutaia.backend.mapper.CursoMapper;
import com.rutaia.backend.modelo.Categoria;
import com.rutaia.backend.modelo.Curso;
import com.rutaia.backend.repositorio.CategoriaRepository;
import com.rutaia.backend.repositorio.CursoRepository;
import com.rutaia.backend.service.CursoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CursoMapper cursoMapper;

    @Override
    public List<CursoResponseDTO> listarTodos() {
        return cursoRepository.findAll().stream()
                .map(cursoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CursoResponseDTO obtenerPorId(Integer id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + id));
        return cursoMapper.toResponseDTO(curso);
    }

    @Override
    public CursoResponseDTO crear(CursoRequestDTO requestDTO) {
        Categoria categoria = categoriaRepository.findById(requestDTO.getIdCategoria())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + requestDTO.getIdCategoria()));

        Curso curso = new Curso();
        curso.setCategoria(categoria);
        curso.setNombre(requestDTO.getNombre());
        curso.setDescripcion(requestDTO.getDescripcion());
        curso.setDificultad(requestDTO.getDificultad());
        curso.setDuracion(requestDTO.getDuracion());
        curso.setActivo(requestDTO.getActivo() != null ? requestDTO.getActivo() : true);

        return cursoMapper.toResponseDTO(cursoRepository.save(curso));
    }

    @Override
    public CursoResponseDTO actualizar(Integer id, CursoRequestDTO requestDTO) {
        Curso cursoExistente = cursoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + id));

        Categoria categoria = categoriaRepository.findById(requestDTO.getIdCategoria())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + requestDTO.getIdCategoria()));

        cursoExistente.setCategoria(categoria);
        cursoExistente.setNombre(requestDTO.getNombre());
        cursoExistente.setDescripcion(requestDTO.getDescripcion());
        cursoExistente.setDificultad(requestDTO.getDificultad());
        cursoExistente.setDuracion(requestDTO.getDuracion());
        if (requestDTO.getActivo() != null) {
            cursoExistente.setActivo(requestDTO.getActivo());
        }

        return cursoMapper.toResponseDTO(cursoRepository.save(cursoExistente));
    }

    @Override
    public void eliminar(Integer id) {
        if (!cursoRepository.existsById(id)) {
            throw new EntityNotFoundException("Curso no encontrado con ID: " + id);
        }
        cursoRepository.deleteById(id);
    }
}