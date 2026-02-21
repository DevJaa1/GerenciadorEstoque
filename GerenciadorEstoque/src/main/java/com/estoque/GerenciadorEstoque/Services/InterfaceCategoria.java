package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Categoria;

import java.util.List;

public interface InterfaceCategoria {

    Categoria saveCategory(Categoria cat);
    List<Categoria> listAllCategory();
    Categoria findIdCategory(Long id);
    Categoria updateCategory(Long id, Categoria catup);
    void deleteCategoryId(Long id);
}
