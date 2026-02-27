package com.estoque.GerenciadorEstoque.Controller;

import com.estoque.GerenciadorEstoque.Entidade.Categoria;
import com.estoque.GerenciadorEstoque.Services.CategoriaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService catService;

    public CategoriaController (CategoriaService catService) {
        this.catService = catService;
    }


//rota listar todas as categorias paginadas
    @GetMapping
    public ResponseEntity<Page<Categoria>> listAllCat (Pageable pageable) {
        return ResponseEntity.ok(catService.listAllCategory(pageable));
    }

//rota para criar categorias
    @PostMapping
    public ResponseEntity<Categoria> creatCat (
            @RequestBody Categoria catNew) {

        Categoria cat = catService.saveCategory(catNew);
        return ResponseEntity.status(201).body(cat);
    }

//Buscar categoria por id
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> catById(
            @PathVariable Long id) {

            return ResponseEntity.ok(catService.findIdCategory(id));
    }

//Atualizar categoria
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> attCat(
            @RequestBody Categoria catAtt,
            @PathVariable Long id) {

            return ResponseEntity.ok(catService.updateCategory(id,catAtt));
    }

//deletar categoria por id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delCat(@PathVariable Long id) {

        catService.deleteCategoryId(id);
        return ResponseEntity.noContent().build();

    }



}
