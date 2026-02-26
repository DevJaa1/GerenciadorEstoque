package com.estoque.GerenciadorEstoque.Repositorio;

import com.estoque.GerenciadorEstoque.Entidade.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepositorio extends JpaRepository<Produto, Long> {

    Page<Produto> findByCategoriaNomeCategoria(
            String nomeCategoria,
            Pageable pageable
    );

    boolean existsByNomeProdutoIgnoreCase(String nomeProduto);
}
