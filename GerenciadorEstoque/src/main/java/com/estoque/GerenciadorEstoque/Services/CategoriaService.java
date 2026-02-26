package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Categoria;
import com.estoque.GerenciadorEstoque.Repositorio.CategoriaRepositorio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService implements InterfaceCategoria {

    private final CategoriaRepositorio categoriaRepositorio;

    public CategoriaService(CategoriaRepositorio categoriaRepositorio) {
        this.categoriaRepositorio = categoriaRepositorio;
    }

    @Override
    public Categoria saveCategory (Categoria cat) {

        if(cat.getNomeCategoria() == null || cat.getNomeCategoria().isBlank()) {
            throw new RuntimeException("The category name is mandatory!");
        }

        return categoriaRepositorio.save(cat);
    }

    @Override
    public Page<Categoria> listAllCategory(Pageable pageable) {
        return categoriaRepositorio.findAll(pageable);
    }

    @Override
    public Categoria findIdCategory(Long id) {
        return categoriaRepositorio.findById(id).orElseThrow(()-> new RuntimeException("Not Found"));
    }

    @Override
    public Categoria updateCategory(Long id, Categoria catup) {

        Categoria catAtt = findIdCategory(id);

        catAtt.setNomeCategoria(catup.getNomeCategoria());
        catAtt.setDescricao(catup.getDescricao());

        return categoriaRepositorio.save(catAtt);

    }

    @Override
    public void deleteCategoryId (Long id) {

        Categoria catDel = findIdCategory(id);

        categoriaRepositorio.delete(catDel);
    }



}
