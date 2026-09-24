package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.response.ConsultaResponseDTO;
import com.rutaia.backend.dto.response.StatsResponseDTO;
import com.rutaia.backend.mapper.ConsultaMapper;
import com.rutaia.backend.modelo.enums.EstadoConsultaEnum;
import com.rutaia.backend.repositorio.CalificacionRepository;
import com.rutaia.backend.repositorio.ConsultaRepository;
import com.rutaia.backend.repositorio.FuenteRepository;
import com.rutaia.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final ConsultaRepository consultaRepository;
    private final CalificacionRepository calificacionRepository;
    private final FuenteRepository fuenteRepository;
    private final ConsultaMapper consultaMapper;

    @Override
    @Transactional(readOnly = true)
    public StatsResponseDTO obtenerEstadisticas() {

        // Un contador por cada estado, incluso si es 0
        Map<String, Long> distribucionEstados = new LinkedHashMap<>();
        for (EstadoConsultaEnum estado : EstadoConsultaEnum.values()) {
            distribucionEstados.put(estado.name(), consultaRepository.countByEstado(estado));
        }

        // Promedio de calificaciones (0.0 si aún no hay ninguna), con 2 decimales
        Double promedio = calificacionRepository.promedioCalificacion();
        double calificacionPromedio = promedio == null ? 0.0 : Math.round(promedio * 100.0) / 100.0;

        // Curso que más veces aparece como fuente (null si no hay recomendaciones)
        List<String> top = fuenteRepository.cursosMasRecomendados(PageRequest.of(0, 1));
        String cursoMasRecomendado = top.isEmpty() ? null : top.get(0);

        List<ConsultaResponseDTO> actividadReciente = consultaRepository
                .findTop10ByOrderByFechaDescIdConsultaDesc().stream()
                .map(consultaMapper::toResponseDTO)
                .toList();

        return new StatsResponseDTO(
                consultaRepository.count(),
                distribucionEstados.get(EstadoConsultaEnum.RESPONDIDA.name()),
                distribucionEstados.get(EstadoConsultaEnum.SIN_RESULTADOS.name()),
                calificacionPromedio,
                cursoMasRecomendado,
                distribucionEstados,
                actividadReciente
        );
    }
}