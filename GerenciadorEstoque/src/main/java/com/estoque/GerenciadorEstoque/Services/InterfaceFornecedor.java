package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InterfaceFornecedor {

    Fornecedor saveSupplier(Fornecedor sup);
    Page<Fornecedor> listAllFornecedor(Pageable pageable);
    Fornecedor findByIdSup(Long id);
    Fornecedor upSup (Long id, Fornecedor supAtt);
    void deleteSup(Long id);
}
