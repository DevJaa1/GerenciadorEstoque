package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;
import com.estoque.GerenciadorEstoque.Repositorio.FornecedorRepositorio;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornecedorService implements InterfaceFornecedor{

    private FornecedorRepositorio fornecedorRepositorio;


    public FornecedorService(FornecedorRepositorio fornecedorRepositorio) {
        this.fornecedorRepositorio = fornecedorRepositorio;
    }

    @Override
    public Fornecedor saveSupplier(Fornecedor sup) {
        if(sup.getNome() == null || sup.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do fornecedor é obrigatório.");

        }
    return fornecedorRepositorio.save(sup);
    }

    @Override
    public List<Fornecedor> listSupplier() {

        return fornecedorRepositorio.findAll();
    }

    @Override
    public Fornecedor findByIdSup (Long id) {

        return fornecedorRepositorio.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Supplier not found!"));

    }

    @Override
    public Fornecedor upSup(Long id, Fornecedor supAtt) {

        Fornecedor supExist = findByIdSup(id);

        supExist.setNome(supAtt.getNome());
        return fornecedorRepositorio.save(supExist);

    }

    @Override
    public void deleteSup(Long id) {

        Fornecedor supDel = findByIdSup(id);

        fornecedorRepositorio.deleteById(id);

    }





}
