package com.estoque.GerenciadorEstoque.Repositorio;


import com.estoque.GerenciadorEstoque.Entidade.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoRepositorio extends JpaRepository <MovimentacaoEstoque, Long> {
}
