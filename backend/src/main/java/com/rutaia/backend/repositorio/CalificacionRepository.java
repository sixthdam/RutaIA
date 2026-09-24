package com.rutaia.backend.repositorio;

import com.rutaia.backend.modelo.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {
    @Query("SELECT AVG(c.calificacion) FROM Calificacion c")
    Double promedioCalificacion();

}
