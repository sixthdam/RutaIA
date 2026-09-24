package com.rutaia.backend.mapper;

import com.rutaia.backend.dto.request.CategoriaRequestDTO;
import com.rutaia.backend.dto.response.CategoriaResponseDTO;
import com.rutaia.backend.modelo.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    // RequestDTO a Entidad
    public Categoria toEntity(CategoriaRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        return categoria;
    }

    // Entidad a ResponseDTO
    public CategoriaResponseDTO toResponseDTO(Categoria categoria) {
        if (categoria == null) {
            return null;
        }
        CategoriaResponseDTO dto = new CategoriaResponseDTO();
        dto.setIdCategoria(categoria.getIdCategoria());
        dto.setNombre(categoria.getNombre());
        return dto;
    }
}