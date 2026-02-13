package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Produto;
import com.estoque.GerenciadorEstoque.Repositorio.ProdutoRepositorio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {


    private final ProdutoRepositorio produtoRepo;

    public ProdutoService (ProdutoRepositorio produtoRepo) {
        this.produtoRepo = produtoRepo;
    }

    //method to find all products
    public List<Produto> findAllproduct() {
        return produtoRepo.findAll();
    }


    //Method to find product by id
    public Produto findAllProductById(Long idProduto ) {
        return produtoRepo.findById(idProduto).orElseThrow(() -> new RuntimeException("Product Not Found!"));
    }

    //find product throught category name in pageable
    public Page<Produto> listByCategory(String nameCategory, Pageable pageable) {
        return produtoRepo.findCategoryByName(nameCategory, pageable);

    }


}
