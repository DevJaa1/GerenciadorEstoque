package com.estoque.GerenciadorEstoque.Entidade;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome deve ser Obrigatório")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 a 100 caracteres")
    private String nome;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Usuário deve ser obrigatório")
    private String usuario;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Login deve ser obrigatório")
    private String login;

    @Column
    @NotBlank(message = "Senha deve ser obrigatória")
    @Size(min = 8, max = 255)
    private String senhausuario;

    @Column
    private boolean contaAtiva;

    @Column(unique = true)
    @Email
    private String email;

    // --- GETTERS E SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    // ADICIONADOS: Getter e Setter para 'usuario'
    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenhausuario() {
        return senhausuario;
    }

    public void setSenhausuario(String senhausuario) {
        this.senhausuario = senhausuario;
    }

    public boolean isContaAtiva() {
        return contaAtiva;
    }

    public void setContaAtiva(boolean contaAtiva) {
        this.contaAtiva = contaAtiva;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}