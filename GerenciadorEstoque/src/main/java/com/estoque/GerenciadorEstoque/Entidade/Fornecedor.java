package com.estoque.GerenciadorEstoque.Entidade;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "fornecedor")
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false)
    private String nome;

    @OneToMany(mappedBy = "fornecedor")
    private List<Produto> produtos;

    @NotBlank
    @Size(max = 20)
    @Column(name = "numero_fornecedor", nullable = false, length = 20)
    private String numeroTelefone;


    @Column(name = "endereco_fornecedor")
    @NotBlank
    private String enderecoFornecedor;


    // Construtor vazio exigido pelo JPA
    public Fornecedor() {
    }

    // Construtor opcional
    public Fornecedor(String nome, String tel) {

        this.nome = nome;
        this.numeroTelefone = tel;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNumeroTelefone() {return numeroTelefone;}

    public void setNumeroTelefone(String numeroTelefone) {this.numeroTelefone = numeroTelefone;}

    public String getEnderecoFornecedor() {
        return enderecoFornecedor;
    }

    public void setEnderecoFornecedor(String enderecoFornecedor) {
        this.enderecoFornecedor = enderecoFornecedor;
    }

    // equals e hashCode baseados no id

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Fornecedor)) return false;
        Fornecedor that = (Fornecedor) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
