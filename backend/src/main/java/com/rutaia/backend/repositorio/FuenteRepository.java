package com.rutaia.backend.repositorio;

import com.rutaia.backend.modelo.Fuente;
import com.rutaia.backend.modelo.FuenteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuenteRepository extends JpaRepository<Fuente, FuenteId> {
    List<Fuente> findByIdIdRecomendacion(Integer idRecomendacion);
}