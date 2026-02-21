package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;

import java.util.List;

public interface InterfaceFornecedor {

    Fornecedor saveSupplier(Fornecedor sup);
    List<Fornecedor> listSupplier ();
    Fornecedor findByIdSup(Long id);
    Fornecedor upSup (Long id, Fornecedor supAtt);
    void deleteSup(Long id);
}
