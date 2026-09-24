package com.rutaia.backend.repositorio;

import com.rutaia.backend.modelo.Recomendacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecomendacionRepository extends JpaRepository<Recomendacion, Integer> {
    Optional<Recomendacion> findByConsultaIdConsulta(Integer idConsulta);
    boolean existsByConsultaIdConsulta(Integer idConsulta);
}