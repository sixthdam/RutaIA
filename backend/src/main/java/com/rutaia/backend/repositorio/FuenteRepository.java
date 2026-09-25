package com.rutaia.backend.repositorio;

import com.rutaia.backend.modelo.Fuente;
import org.springframework.data.domain.Pageable;
import com.rutaia.backend.modelo.FuenteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuenteRepository extends JpaRepository<Fuente, FuenteId> {
    List<Fuente> findByIdIdRecomendacion(Integer idRecomendacion);
    @Query("SELECT f.curso.nombre FROM Fuente f GROUP BY f.curso.idCurso, f.curso.nombre ORDER BY COUNT(f) DESC")
    List cursosMasRecomendados(Pageable pageable);
    @Query("SELECT f.curso.nombre FROM Fuente f " +
            "WHERE f.recomendacion.consulta.usuario.idUsuario = :idUsuario " +
            "GROUP BY f.curso.idCurso, f.curso.nombre ORDER BY COUNT(f) DESC")
    List cursosMasRecomendadosPorUsuario(@Param("idUsuario") Integer idUsuario, Pageable pageable);
}