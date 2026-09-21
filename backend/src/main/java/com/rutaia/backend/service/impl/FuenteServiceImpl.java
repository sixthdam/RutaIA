package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.request.FuenteRequestDTO;
import com.rutaia.backend.dto.response.FuenteResponseDTO;
import com.rutaia.backend.mapper.FuenteMapper;
import com.rutaia.backend.modelo.Curso;
import com.rutaia.backend.modelo.Fuente;
import com.rutaia.backend.modelo.FuenteId;
import com.rutaia.backend.modelo.Recomendacion;
import com.rutaia.backend.repositorio.CursoRepository;
import com.rutaia.backend.repositorio.FuenteRepository;
import com.rutaia.backend.repositorio.RecomendacionRepository;
import com.rutaia.backend.service.FuenteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuenteServiceImpl implements FuenteService {

    private final FuenteRepository fuenteRepository;
    private final RecomendacionRepository recomendacionRepository;
    private final CursoRepository cursoRepository;
    private final FuenteMapper fuenteMapper;

    @Override
    public List<FuenteResponseDTO> listarTodas() {
        return fuenteRepository.findAll().stream()
                .map(fuenteMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FuenteResponseDTO> listarPorRecomendacion(Integer idRecomendacion) {
        return fuenteRepository.findByIdIdRecomendacion(idRecomendacion).stream()
                .map(fuenteMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FuenteResponseDTO registrar(FuenteRequestDTO requestDTO) {
        Recomendacion recomendacion = recomendacionRepository.findById(requestDTO.getIdRecomendacion())
                .orElseThrow(() -> new EntityNotFoundException("Recomendación no encontrada con ID: " + requestDTO.getIdRecomendacion()));

        Curso curso = cursoRepository.findById(requestDTO.getIdCurso())
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + requestDTO.getIdCurso()));

        FuenteId fuenteId = new FuenteId(requestDTO.getIdRecomendacion(), requestDTO.getIdCurso());

        Fuente fuente = new Fuente();
        fuente.setId(fuenteId);
        fuente.setRecomendacion(recomendacion);
        fuente.setCurso(curso);
        fuente.setSimilitud(requestDTO.getSimilitud());

        return fuenteMapper.toResponseDTO(fuenteRepository.save(fuente));
    }

    @Override
    public void eliminar(Integer idRecomendacion, Integer idCurso) {
        FuenteId fuenteId = new FuenteId(idRecomendacion, idCurso);
        if (!fuenteRepository.existsById(fuenteId)) {
            throw new EntityNotFoundException("Fuente no encontrada para la recomendación y curso especificados.");
        }
        fuenteRepository.deleteById(fuenteId);
    }
}