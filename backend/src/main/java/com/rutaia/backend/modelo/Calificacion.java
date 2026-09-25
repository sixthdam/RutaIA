package com.rutaia.backend.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "calificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Calificacion implements Persistable<Integer> {

    @Id
    @Column(name = "id_recomendacion")
    private Integer idRecomendacion;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_recomendacion")
    private Recomendacion recomendacion;

    @Column(name = "calificacion", nullable = false)
    private Integer calificacion;

    @Transient
    private boolean esNueva = true;

    @Override
    public Integer getId() {
        return idRecomendacion;
    }

    @Override
    public boolean isNew() {
        return esNueva;
    }

    @PostLoad
    @PostPersist
    void marcarComoExistente() {
        this.esNueva = false;
    }
}