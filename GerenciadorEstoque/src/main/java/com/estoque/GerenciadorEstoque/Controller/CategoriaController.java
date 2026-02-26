package com.estoque.GerenciadorEstoque.Controller;

import com.estoque.GerenciadorEstoque.Entidade.Categoria;
import com.estoque.GerenciadorEstoque.Services.CategoriaService;
import com.estoque.GerenciadorEstoque.Services.ProdutoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
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
    public Page<Categoria> listAllCat (Pageable pageable) {
        return catService.listAllCategory(pageable);
    }

//rota para criar categorias
    @PostMapping
    public Categoria creatCat (@RequestBody Categoria catNew) {
        return catService.saveCategory(catNew);
    }

//Buscar categoria por id
    @GetMapping("/{id}")
    public Categoria catById(@PathVariable Long id) {
        return catService.findIdCategory(id);
    }

//Atualizar categoria
    @PutMapping("/{id}")
    public Categoria attCat(@RequestBody Categoria catAtt, @PathVariable Long id) {
        return catService.updateCategory(id,catAtt);
    }

//deletar categoria por id
    @DeleteMapping("/{id}")
    public void delCat(@PathVariable Long id) {
        catService.deleteCategoryId(id);
    }



}
