package com.estoque.GerenciadorEstoque.Controller;

import com.estoque.GerenciadorEstoque.Entidade.Produto;
import com.estoque.GerenciadorEstoque.Services.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService prdService) {
        this.produtoService = prdService;
    }
//listar todos os produtos
    @GetMapping
    public ResponseEntity<List<Produto>> listAll() {
        return ResponseEntity.ok(produtoService.findAllproduct());
    }

//encontrar produto pelo id
    @GetMapping("/{id}")
    public ResponseEntity<Produto> findById (@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.productById(id));
    }
//salvar produto
    @PostMapping
    public ResponseEntity<Produto> saveProduct (@RequestBody Produto produto, @PathVariable Long id) {
        return ResponseEntity.ok(produtoService.registerProduct(produto, id));
    }
//atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Produto> attProduct (@RequestBody Produto produto, @PathVariable Long id, @PathVariable Long idCat) {
        return ResponseEntity.ok(produtoService.alterProduct(id,produto,idCat));
    }
//delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable long id) {
        return ResponseEntity.noContent().build();
    }

}
