package com.rutaia.backend.repositorio;

import com.rutaia.backend.modelo.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {
    List<Consulta> findByUsuarioIdUsuario(Integer idUsuario);
}