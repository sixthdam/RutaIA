package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.request.CalificacionRequestDTO;
import com.rutaia.backend.dto.response.CalificacionResponseDTO;
import com.rutaia.backend.exceptions.BusinessRuleException;
import com.rutaia.backend.mapper.CalificacionMapper;
import com.rutaia.backend.modelo.Calificacion;
import com.rutaia.backend.modelo.Recomendacion;
import com.rutaia.backend.repositorio.CalificacionRepository;
import com.rutaia.backend.repositorio.RecomendacionRepository;
import com.rutaia.backend.service.CalificacionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalificacionServiceImpl implements CalificacionService {

    private final CalificacionRepository calificacionRepository;
    private final RecomendacionRepository recomendacionRepository;
    private final CalificacionMapper calificacionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CalificacionResponseDTO> listarTodas() {
        return calificacionRepository.findAll().stream()
                .map(calificacionMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CalificacionResponseDTO obtenerPorId(Integer idRecomendacion) {
        Calificacion calificacion = calificacionRepository.findById(idRecomendacion)
                .orElseThrow(() -> new EntityNotFoundException("Calificación no encontrada para la recomendación ID: " + idRecomendacion));
        return calificacionMapper.toResponseDTO(calificacion);
    }

    @Override
    @Transactional
    public CalificacionResponseDTO registrar(CalificacionRequestDTO requestDTO) {
        Recomendacion recomendacion = recomendacionRepository.findById(requestDTO.getIdRecomendacion())
                .orElseThrow(() -> new EntityNotFoundException("Recomendación no encontrada con ID: " + requestDTO.getIdRecomendacion()));

        // Regla de negocio: Una sola calificación por recomendación
        if (calificacionRepository.existsById(requestDTO.getIdRecomendacion())) {
            throw new BusinessRuleException("Esta recomendación ya ha sido calificada anteriormente.");
        }

        Calificacion calificacion = new Calificacion();
        calificacion.setIdRecomendacion(recomendacion.getIdRecomendacion());  // <-- esta línea es la clave
        calificacion.setRecomendacion(recomendacion);
        calificacion.setCalificacion(requestDTO.getCalificacion());

        return calificacionMapper.toResponseDTO(calificacionRepository.save(calificacion));
    }

    @Override
    public void eliminar(Integer idRecomendacion) {
        if (!calificacionRepository.existsById(idRecomendacion)) {
            throw new EntityNotFoundException("Calificación no encontrada para la recomendación ID: " + idRecomendacion);
        }
        calificacionRepository.deleteById(idRecomendacion);
    }
}