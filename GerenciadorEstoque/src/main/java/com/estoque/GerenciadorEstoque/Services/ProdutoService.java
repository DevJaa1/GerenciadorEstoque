package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Entidade.Categoria;
import com.estoque.GerenciadorEstoque.Entidade.Fornecedor;
import com.estoque.GerenciadorEstoque.Entidade.MovimentacaoEstoque;
import com.estoque.GerenciadorEstoque.Entidade.Produto;
import com.estoque.GerenciadorEstoque.Repositorio.CategoriaRepositorio;
import com.estoque.GerenciadorEstoque.Repositorio.FornecedorRepositorio;
import com.estoque.GerenciadorEstoque.Repositorio.ProdutoRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepositorio produtoRepo;
    private final CategoriaRepositorio catRepo;
    private final FornecedorRepositorio fornecedorRepo;

    public ProdutoService(ProdutoRepositorio produtoRepo, CategoriaRepositorio catRepo, FornecedorRepositorio fornecedorRepo) {
        this.produtoRepo = produtoRepo;
        this.catRepo = catRepo;
        this.fornecedorRepo = fornecedorRepo;
    }

    // Find all
    public List<Produto> findAllproduct() {
        return produtoRepo.findAll();
    }

    // Find by id
    public Produto productById(Long idProduto) {
        return produtoRepo.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Product Not Found!"));
    }

    // Find by category pageable
    public Page<Produto> listByCategory(String nameCategory, Pageable pageable) {
        return produtoRepo.findByCategoriaNomeCategoria(nameCategory, pageable);
    }

    // =========================
    // REGISTER PRODUCT
    // =========================
    @Transactional
    public Produto registerProduct(Produto newProd, Long categoriaId) {

        if(newProd.getFornecedor() == null ||
                newProd.getFornecedor().getId() == null){
            throw new RuntimeException("Supplier must be informed");
        }

        Categoria catSearch = catRepo.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        Fornecedor fornecedor = fornecedorRepo
                .findById(newProd.getFornecedor().getId())
                .orElseThrow(() -> new RuntimeException("Supplier Not Found"));

        if (produtoRepo.existsByNomeProdutoIgnoreCase(newProd.getNomeProduto())) {
            throw new RuntimeException("Product already registered!");
        }

        if (newProd.getQuantidadeItens() == null || newProd.getQuantidadeItens() < 0) {
            throw new RuntimeException("Invalid stock quantity");
        }

        if (newProd.getPrecoCusto() == null ||
                newProd.getPrecoCusto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Cost Price must be valid");
        }

        if (newProd.getPrecoVenda() == null ||
                newProd.getPrecoVenda().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Sale Price must be valid");
        }

        if (newProd.getPrecoVenda()
                .compareTo(newProd.getPrecoCusto()) < 0) {
            throw new RuntimeException("Sale price cannot be lower than cost price");
        }

        newProd.setCategoria(catSearch);
        newProd.setFornecedor(fornecedor);
        newProd.setAtivo(true);

        return produtoRepo.save(newProd);
    }

    // =========================
    // UPDATE PRODUCT
    // =========================
    @Transactional
    public Produto alterProduct(Long idProd, Produto prodatt, Long catId) {

        Produto productExist = produtoRepo.findById(idProd)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        // Update name
        if (prodatt.getNomeProduto() != null &&
                !prodatt.getNomeProduto().equalsIgnoreCase(productExist.getNomeProduto())) {

            if (produtoRepo.existsByNomeProdutoIgnoreCase(prodatt.getNomeProduto())) {
                throw new RuntimeException("Product already exist!");
            }

            productExist.setNomeProduto(prodatt.getNomeProduto());
        }

        // Update description
        if (prodatt.getDescricao() != null) {
            productExist.setDescricao(prodatt.getDescricao());
        }

        // Update sale price
        if (prodatt.getPrecoVenda() != null) {

            if (prodatt.getPrecoVenda().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Invalid sale price");
            }

            productExist.setPrecoVenda(prodatt.getPrecoVenda());
        }

        // Update cost price
        if (prodatt.getPrecoCusto() != null) {

            if (prodatt.getPrecoCusto().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Invalid cost price");
            }

            productExist.setPrecoCusto(prodatt.getPrecoCusto());
        }

        // Validate relationship
        if (productExist.getPrecoVenda()
                .compareTo(productExist.getPrecoCusto()) < 0) {

            throw new RuntimeException("Sale price must be greater than cost price");
        }

        // Update category
        if (catId != null) {

            Categoria catNew = catRepo.findById(catId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            productExist.setCategoria(catNew);
        }

        // Update status
        if (prodatt.getAtivo() != null) {
            productExist.setAtivo(prodatt.getAtivo());
        }

        return produtoRepo.save(productExist);
    }

    //delete product by id
    @Transactional
    public void deleteProductId(Long id) {
        if(!produtoRepo.existsById(id)) {
            throw new RuntimeException("Product not found!");
        }
        produtoRepo.deleteById(id);
    }


}
