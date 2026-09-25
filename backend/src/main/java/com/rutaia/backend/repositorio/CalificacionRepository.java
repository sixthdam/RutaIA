package com.rutaia.backend.repositorio;

import com.rutaia.backend.modelo.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {
    @Query("SELECT AVG(c.calificacion) FROM Calificacion c")
    Double promedioCalificacion();

    @Query("SELECT AVG(c.calificacion) FROM Calificacion c " +
            "WHERE c.recomendacion.consulta.usuario.idUsuario = :idUsuario")
    Double promedioCalificacionPorUsuario(@Param("idUsuario") Integer idUsuario);
}
