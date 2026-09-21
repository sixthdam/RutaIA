package com.rutaia.backend.mapper;

import com.rutaia.backend.dto.response.ConsultaResponseDTO;
import com.rutaia.backend.modelo.Consulta;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConsultaMapper {

    private final UsuarioMapper usuarioMapper;

    public ConsultaResponseDTO toResponseDTO(Consulta consulta) {
        if (consulta == null) {
            return null;
        }
        ConsultaResponseDTO dto = new ConsultaResponseDTO();
        dto.setIdConsulta(consulta.getIdConsulta());
        dto.setUsuario(usuarioMapper.toResponseDTO(consulta.getUsuario()));
        dto.setPregunta(consulta.getPregunta());
        dto.setFecha(consulta.getFecha());
        dto.setEstado(consulta.getEstado());
        return dto;
    }
}
