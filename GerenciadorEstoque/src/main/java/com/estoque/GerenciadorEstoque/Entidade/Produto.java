package com.estoque.GerenciadorEstoque.Entidade;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do produto é obrigatório")
    @Column(nullable = false)
    private String nomeProduto;

    @NotBlank(message = "A descrição do produto é obrigatória")
    @Column(nullable = false)
    private String descricao;

    @NotNull(message = "A quantidade em estoque é obrigatória")
    @PositiveOrZero(message = "A quantidade não pode ser negativa")
    @Column(nullable = false)
    private Integer quantidadeItens;

    @NotNull(message = "O status do produto é obrigatório")
    @Column(nullable = false)
    private Boolean ativo;

    @NotNull(message = "O preço de venda é obrigatório")
    @Column(nullable = false, precision = 10, scale = 2)
    @PositiveOrZero
    private BigDecimal precoVenda;

    @NotNull(message = "O preço de custo é obrigatório")
    @Column(nullable = false, precision = 10, scale = 2)
    @PositiveOrZero
    private BigDecimal precoCusto;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @OneToMany(mappedBy = "produto")
    private List<MovimentacaoEstoque> movimentacoes;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id", nullable = false)
    private Fornecedor fornecedor;


    // Construtor padrão exigido pelo JPA
    public Produto() {
    }

    // Construtor de negócio (sem ID)
    public Produto(String nomeProduto,
                   String descricao,
                   Integer quantidadeItens,
                   Boolean ativo,
                   BigDecimal precoCusto,
                   BigDecimal precoVenda) {
        this.nomeProduto = nomeProduto;
        this.descricao = descricao;
        this.quantidadeItens = quantidadeItens;
        this.ativo = ativo;
        this.precoCusto = precoCusto;
        this.precoVenda = precoVenda;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getQuantidadeItens() {
        return quantidadeItens;
    }

    public void setQuantidadeItens(Integer quantidadeItens) {
        this.quantidadeItens = quantidadeItens;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Produto other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
