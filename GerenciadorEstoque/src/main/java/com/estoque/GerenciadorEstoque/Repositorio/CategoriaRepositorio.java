package com.estoque.GerenciadorEstoque.Repositorio;

import com.estoque.GerenciadorEstoque.Entidade.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepositorio extends JpaRepository <Categoria, Long > {



}
