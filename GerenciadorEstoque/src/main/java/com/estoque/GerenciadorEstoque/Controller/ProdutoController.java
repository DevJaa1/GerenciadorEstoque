package com.estoque.GerenciadorEstoque.Controller;

import com.estoque.GerenciadorEstoque.Entidade.Produto;
import com.estoque.GerenciadorEstoque.Services.ProdutoService;
import jakarta.servlet.ServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

//Encontrar pela categoria
    @GetMapping("/categorias")
    public ResponseEntity<Page<Produto>> findByCategory(@RequestParam String categoryname, Pageable pageable) {
        return ResponseEntity.ok(produtoService.listByCategory(categoryname,pageable));
    }

//salvar produto
@PostMapping("/categorias/{categoriaId}/produtos")
public ResponseEntity<Produto> saveProduct(
        @RequestBody Produto produto,
        @PathVariable Long categoriaId) {

    Produto prdNew = produtoService.registerProduct(produto, categoriaId);

    return ResponseEntity.status(HttpStatus.CREATED).body(prdNew);
}
//atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Produto> attProduct (@RequestBody Produto produto,
                                               @PathVariable Long id,
                                               @RequestParam(required = false) Long idCat) {
        return ResponseEntity.ok(produtoService.alterProduct(id,produto,idCat));
    }
//delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable long id) {
        return ResponseEntity.noContent().build();
    }

}
