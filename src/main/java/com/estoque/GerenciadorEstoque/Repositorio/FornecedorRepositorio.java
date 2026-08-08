package com.estoque.GerenciadorEstoque.Repositorio;

import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FornecedorRepositorio extends JpaRepository <Fornecedor, Long>  {

}
