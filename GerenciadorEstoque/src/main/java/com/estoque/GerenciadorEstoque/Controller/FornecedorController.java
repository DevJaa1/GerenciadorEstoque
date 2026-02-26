package com.estoque.GerenciadorEstoque.Controller;

import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;
import com.estoque.GerenciadorEstoque.Services.FornecedorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    public FornecedorController(FornecedorService fornecedorService) {
        this.fornecedorService = fornecedorService;
    }

    @GetMapping
    public ResponseEntity<Page<Fornecedor>> listSupplier(Pageable pageable) {
        return ResponseEntity.ok(
                fornecedorService.listAllFornecedor(pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fornecedor> fornecedorById(@PathVariable Long id) {
        return ResponseEntity.ok(
                fornecedorService.findByIdSup(id)
        );
    }

    @PostMapping
    public ResponseEntity<Fornecedor> criarFornecedor(
            @RequestBody Fornecedor fornecedor) {

        return ResponseEntity.ok(
                fornecedorService.saveSupplier(fornecedor)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fornecedor> attFornecedor(
            @PathVariable Long id,
            @RequestBody Fornecedor newFor) {

        return ResponseEntity.ok(
                fornecedorService.upSup(id, newFor)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFornecedor(@PathVariable Long id) {

        fornecedorService.deleteSup(id);
        return ResponseEntity.noContent().build();
    }
}


