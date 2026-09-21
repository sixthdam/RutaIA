package com.rutaia.backend.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fuentes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fuente {

    @EmbeddedId
    private FuenteId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idRecomendacion")
    @JoinColumn(name = "id_recomendacion")
    private Recomendacion recomendacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCurso")
    @JoinColumn(name = "id_curso")
    private Curso curso;

    @Column(name = "similitud", nullable = false)
    private Double similitud;
}