package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;
import com.estoque.GerenciadorEstoque.Repositorio.FornecedorRepositorio;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornecedorService implements InterfaceFornecedor{

    private FornecedorRepositorio fornecedorRepositorio;


    public FornecedorService(FornecedorRepositorio fornecedorRepositorio) {
        this.fornecedorRepositorio = fornecedorRepositorio;
    }

    //criar fornecedor
    @Override
    public Fornecedor saveSupplier(Fornecedor sup) {
        if(sup.getNome() == null || sup.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do fornecedor é obrigatório.");
        }

        if(sup.getNumeroTelefone() == null || sup.getNumeroTelefone().isBlank()) {
            throw new IllegalArgumentException("Telefone Inválido!");
        }

        if(sup.getEnderecoFornecedor() == null || sup.getEnderecoFornecedor().isBlank()) {
            throw new IllegalArgumentException("Endereço Inválido");
        }
    return fornecedorRepositorio.save(sup);
    }


    //listar todos os fornecedores paginados
    @Override
    public Page<Fornecedor> listAllFornecedor(Pageable pageable) {

        return fornecedorRepositorio.findAll(pageable);
    }


    //encontrar fornecedores por id
    @Override
    public Fornecedor findByIdSup (Long id) {

        return fornecedorRepositorio.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Supplier not found!"));

    }


    //atualizar fornecedores pelo id
    @Override
    public Fornecedor upSup(Long id, Fornecedor supAtt) {

        Fornecedor supExist = findByIdSup(id);

        supExist.setNumeroTelefone(supAtt.getNumeroTelefone());
        supExist.setNome(supAtt.getNome());
        supExist.setEnderecoFornecedor(supExist.getEnderecoFornecedor());
        return fornecedorRepositorio.save(supExist);

    }


    //deletar fornecedores pelo id
    @Override
    public void deleteSup(Long id) {

        Fornecedor supDel = findByIdSup(id);

        fornecedorRepositorio.deleteById(id);

    }





}
