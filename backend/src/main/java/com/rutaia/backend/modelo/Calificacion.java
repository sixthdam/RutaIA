package com.rutaia.backend.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "calificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Calificacion {

    @Id
    @Column(name = "id_recomendacion")
    private Integer idRecomendacion;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_recomendacion")
    private Recomendacion recomendacion;

    @Column(name = "calificacion", nullable = false)
    private Integer calificacion;
}