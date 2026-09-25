package com.rutaia.backend.repositorio;

import com.rutaia.backend.modelo.Consulta;
import com.rutaia.backend.modelo.enums.EstadoConsultaEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {
    List<Consulta> findByUsuarioIdUsuario(Integer idUsuario);

    long countByEstado(EstadoConsultaEnum estado);
    List<Consulta> findTop10ByOrderByFechaDescIdConsultaDesc();

    long countByUsuarioIdUsuario(Integer idUsuario);
    long countByEstadoAndUsuarioIdUsuario(EstadoConsultaEnum estado, Integer idUsuario);
    List<Consulta> findTop10ByUsuarioIdUsuarioOrderByFechaDescIdConsultaDesc(Integer idUsuario);
}
