package com.estoque.GerenciadorEstoque.Controller;

import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;
import com.estoque.GerenciadorEstoque.Services.FornecedorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    public FornecedorController(FornecedorService fornecedorService) {
        this.fornecedorService = fornecedorService;
    }

    //Listar todos os fornecedores paginado
    @GetMapping
    public Page<Fornecedor> listSupplier (Pageable pageable) {
        return fornecedorService.listAllFornecedor(pageable);
    }


    //Buscar fornecedor por id
    @GetMapping("/{id}")
    public Fornecedor fornecedorById(@PathVariable Long id) {
        return fornecedorService.findByIdSup(id);
    }

    //criar fornecedor
    @PostMapping
    public Fornecedor criarFornecedor(@RequestBody Fornecedor fornecedor) {
        return fornecedorService.saveSupplier(fornecedor);
    }

    //atualizar fornecedor
    @PutMapping("/{id}")
    public Fornecedor attFornecedor(@PathVariable Long id, @RequestBody Fornecedor newFor) {
        return fornecedorService.upSup(id, newFor);
    }

    //deletar fornecedor
    @DeleteMapping("/{id}")
    public void deleteFornecedor(@PathVariable Long id) {
        fornecedorService.deleteSup(id);
    }





}
