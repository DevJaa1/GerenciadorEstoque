package com.estoque.GerenciadorEstoque.Repositorio;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoRepositorio extends JpaRepository <MovimentacaoRepositorio, Long> {
}
