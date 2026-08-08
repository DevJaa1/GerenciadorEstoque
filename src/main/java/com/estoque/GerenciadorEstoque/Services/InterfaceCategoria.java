package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InterfaceCategoria {

    Categoria saveCategory(Categoria cat);
    Page<Categoria> listAllCategory(Pageable pageable);
    Categoria findIdCategory(Long id);
    Categoria updateCategory(Long id, Categoria catup);
    void deleteCategoryId(Long id);
}
