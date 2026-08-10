package com.estoque.GerenciadorEstoque.Repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estoque.GerenciadorEstoque.Entidade.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByNome(String nome);

    boolean existsByNome(String nome);

    boolean existisByUsuario(String usuario);

    Optional<Usuario> findByEmail(String email);
    
    Boolean findByEmailValid(String email);

	boolean existsByLogin(String login);
}