package com.rutaia.backend.service.impl;

import com.rutaia.backend.dto.request.ConsultaRequestDTO;
import com.rutaia.backend.dto.response.ConsultaResponseDTO;
import com.rutaia.backend.mapper.ConsultaMapper;
import com.rutaia.backend.modelo.Consulta;
import com.rutaia.backend.modelo.Usuario;
import com.rutaia.backend.modelo.enums.EstadoConsultaEnum;
import com.rutaia.backend.repositorio.ConsultaRepository;
import com.rutaia.backend.repositorio.UsuarioRepository;
import com.rutaia.backend.service.ConsultaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultaServiceImpl implements ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConsultaMapper consultaMapper;

    @Override
    public List<ConsultaResponseDTO> listarTodas() {
        return consultaRepository.findAll().stream()
                .map(consultaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ConsultaResponseDTO obtenerPorId(Integer id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada con ID: " + id));
        return consultaMapper.toResponseDTO(consulta);
    }

    @Override
    public List<ConsultaResponseDTO> listarPorUsuario(Integer idUsuario) {
        // Validamos que el usuario exista antes de buscar su historial
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + idUsuario);
        }
        return consultaRepository.findByUsuarioIdUsuario(idUsuario).stream()
                .map(consultaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ConsultaResponseDTO registrar(ConsultaRequestDTO requestDTO) {

        Usuario usuario = usuarioRepository.findById(requestDTO.getIdUsuario())
                .orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado con ID: " + requestDTO.getIdUsuario()));

        Consulta consulta = new Consulta();
        consulta.setUsuario(usuario);
        consulta.setPregunta(requestDTO.getPregunta());
        consulta.setFecha(requestDTO.getFecha() != null ? requestDTO.getFecha() : LocalDate.now());
        consulta.setEstado(requestDTO.getEstado() != null ? requestDTO.getEstado() : EstadoConsultaEnum.PENDIENTE);

        return consultaMapper.toResponseDTO(consultaRepository.save(consulta));
    }

    @Override
    public ConsultaResponseDTO actualizarEstado(Integer id, String nuevoEstado) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada con ID: " + id));

        consulta.setEstado(EstadoConsultaEnum.valueOf(nuevoEstado.toUpperCase()));
        return consultaMapper.toResponseDTO(consultaRepository.save(consulta));
    }

    @Override
    public void eliminar(Integer id) {
        if (!consultaRepository.existsById(id)) {
            throw new EntityNotFoundException("Consulta no encontrada con ID: " + id);
        }
        consultaRepository.deleteById(id);
    }
}