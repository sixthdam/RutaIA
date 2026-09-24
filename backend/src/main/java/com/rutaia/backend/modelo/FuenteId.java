package com.rutaia.backend.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuenteId implements Serializable {
    @Column(name = "id_recomendacion")
    private Integer idRecomendacion;

    @Column(name = "id_curso")
    private Integer idCurso;
}