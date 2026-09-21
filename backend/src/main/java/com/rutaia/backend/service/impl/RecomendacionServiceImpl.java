package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.request.RecomendacionRequestDTO;
import com.rutaia.backend.dto.response.RecomendacionResponseDTO;
import com.rutaia.backend.mapper.RecomendacionMapper;
import com.rutaia.backend.modelo.Consulta;
import com.rutaia.backend.modelo.Recomendacion;
import com.rutaia.backend.repositorio.ConsultaRepository;
import com.rutaia.backend.repositorio.RecomendacionRepository;
import com.rutaia.backend.service.RecomendacionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecomendacionServiceImpl implements RecomendacionService {

    private final RecomendacionRepository recomendacionRepository;
    private final ConsultaRepository consultaRepository;
    private final RecomendacionMapper recomendacionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<RecomendacionResponseDTO> listarTodas() {
        return recomendacionRepository.findAll().stream()
                .map(recomendacionMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RecomendacionResponseDTO obtenerPorId(Integer id) {
        Recomendacion recomendacion = recomendacionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recomendación no encontrada con ID: " + id));
        return recomendacionMapper.toResponseDTO(recomendacion);
    }

    @Override
    @Transactional(readOnly = true)
    public RecomendacionResponseDTO obtenerPorConsulta(Integer idConsulta) {
        Recomendacion recomendacion = recomendacionRepository.findByConsultaIdConsulta(idConsulta)
                .orElseThrow(() -> new EntityNotFoundException("No hay recomendación asociada a la consulta ID: " + idConsulta));
        return recomendacionMapper.toResponseDTO(recomendacion);
    }

    @Override
    public RecomendacionResponseDTO registrar(RecomendacionRequestDTO requestDTO) {
        Consulta consulta = consultaRepository.findById(requestDTO.getIdConsulta())
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada con ID: " + requestDTO.getIdConsulta()));

        Recomendacion recomendacion = new Recomendacion();
        recomendacion.setConsulta(consulta);
        recomendacion.setRespuesta(requestDTO.getRespuesta());
        recomendacion.setFecha(requestDTO.getFecha() != null ? requestDTO.getFecha() : LocalDate.now());

        return recomendacionMapper.toResponseDTO(recomendacionRepository.save(recomendacion));
    }

    @Override
    public RecomendacionResponseDTO actualizar(Integer id, RecomendacionRequestDTO requestDTO) {
        Recomendacion recomendacionExistente = recomendacionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recomendación no encontrada con ID: " + id));

        Consulta consulta = consultaRepository.findById(requestDTO.getIdConsulta())
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada con ID: " + requestDTO.getIdConsulta()));

        recomendacionExistente.setConsulta(consulta);
        recomendacionExistente.setRespuesta(requestDTO.getRespuesta());
        if (requestDTO.getFecha() != null) {
            recomendacionExistente.setFecha(requestDTO.getFecha());
        }

        return recomendacionMapper.toResponseDTO(recomendacionRepository.save(recomendacionExistente));
    }

    @Override
    public void eliminar(Integer id) {
        if (!recomendacionRepository.existsById(id)) {
            throw new EntityNotFoundException("Recomendación no encontrada con ID: " + id);
        }
        recomendacionRepository.deleteById(id);
    }
}