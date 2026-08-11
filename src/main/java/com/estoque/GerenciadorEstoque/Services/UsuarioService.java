package com.estoque.GerenciadorEstoque.Services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.estoque.GerenciadorEstoque.Entidade.Usuario;
import com.estoque.GerenciadorEstoque.Repositorio.UsuarioRepositorio;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepositorio usuarioRepositorio,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // AUTENTICAR USUÁRIO
    // =========================================================

    @Transactional
    public Usuario autenticarUsuario(String senha, String email) {

        Usuario usuarioAuth = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Email ou senha inválidos!"));

        if (!usuarioAuth.isContaAtiva()) {
            throw new RuntimeException("Conta se encontra desativada!");
        }

        boolean senhaValida = passwordEncoder.matches(
                senha,
                usuarioAuth.getSenhausuario()
        );

        if (!senhaValida) {
            throw new RuntimeException("Email ou senha inválidos!");
        }

        return usuarioAuth;
    }

    // =========================================================
    // CADASTRAR USUÁRIO
    // =========================================================

    @Transactional
    public Usuario cadastroUsuario(Usuario usucad) {

        if (usuarioRepositorio.existsByNome(usucad.getNome())) {
            throw new RuntimeException(
                    "Nome de usuário já cadastrado!"
            );
        }

        if (usuarioRepositorio.existsByEmail(usucad.getEmail())) {
            throw new RuntimeException(
                    "Email já cadastrado!"
            );
        }

        if (usuarioRepositorio.existsByLogin(usucad.getLogin())) {
            throw new RuntimeException(
                    "Login já cadastrado!"
            );
        }

        // Criptografa a senha antes de salvar
        String senhaCriptografada =
                passwordEncoder.encode(usucad.getSenhausuario());

        usucad.setSenhausuario(senhaCriptografada);

        return usuarioRepositorio.save(usucad);
    }

    // =========================================================
    // BUSCAR USUÁRIO POR ID
    // =========================================================

    @Transactional
    public Usuario buscarPorId(Long id) {

        return usuarioRepositorio.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuário não encontrado com o ID: " + id
                        ));
    }

    // =========================================================
    // BUSCAR USUÁRIO PELO NOME
    // =========================================================

    @Transactional
    public Usuario buscarUsuarioNome(String nome) {

        return usuarioRepositorio.findByNome(nome)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuário não encontrado"
                        ));
    }

    // =========================================================
    // LISTAR USUÁRIOS
    // =========================================================

    @Transactional
    public List<Usuario> listarusuariosregistrados() {

        return usuarioRepositorio.findAll();
    }

    // =========================================================
    // ALTERAR SENHA
    // =========================================================

    @Transactional
    public Usuario alterarSenha(
            String senhaAtual,
            String senhaNova,
            String email) {

        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuário não encontrado"
                        ));

        if (!usuario.isContaAtiva()) {
            throw new RuntimeException(
                    "Não é possível alterar senha de conta desativada!"
            );
        }

        // Verifica a senha atual
        boolean senhaAtualValida = passwordEncoder.matches(
                senhaAtual,
                usuario.getSenhausuario()
        );

        if (!senhaAtualValida) {
            throw new RuntimeException(
                    "Senha atual inválida!"
            );
        }

        // Verifica se a nova senha é igual à antiga
        boolean mesmaSenha = passwordEncoder.matches(
                senhaNova,
                usuario.getSenhausuario()
        );

        if (mesmaSenha) {
            throw new RuntimeException(
                    "Senha nova deve ser diferente da senha atual!"
            );
        }

        // Criptografa a nova senha
        String novaSenhaCriptografada =
                passwordEncoder.encode(senhaNova);

        usuario.setSenhausuario(novaSenhaCriptografada);

        return usuarioRepositorio.save(usuario);
    }

    // =========================================================
    // ATUALIZAR CADASTRO
    // =========================================================

    @Transactional
    public Usuario atualizarCadastro(
            Usuario attUsuario,
            Long id) {

        Usuario usu = usuarioRepositorio.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuário não encontrado!"
                        ));

        // -------------------------
        // Atualizar email
        // -------------------------

        if (attUsuario.getEmail() != null &&
                !attUsuario.getEmail()
                        .equalsIgnoreCase(usu.getEmail())) {

            boolean emailUso =
                    usuarioRepositorio.existsByEmail(
                            attUsuario.getEmail()
                    );

            if (emailUso) {
                throw new IllegalArgumentException(
                        "Email já está em uso para outro usuário!"
                );
            }

            usu.setEmail(attUsuario.getEmail());
        }

        // -------------------------
        // Atualizar login
        // -------------------------

        if (attUsuario.getLogin() != null &&
                !attUsuario.getLogin()
                        .equalsIgnoreCase(usu.getLogin())) {

            boolean loginEmUso =
                    usuarioRepositorio.existsByLogin(
                            attUsuario.getLogin()
                    );

            if (loginEmUso) {
                throw new IllegalArgumentException(
                        "Este login já está em uso por outro usuário."
                );
            }

            usu.setLogin(attUsuario.getLogin());
        }

        // -------------------------
        // Atualizar nome
        // -------------------------

        if (attUsuario.getNome() != null) {
            usu.setNome(attUsuario.getNome());
        }

        // Salva o usuário encontrado pelo ID
        return usuarioRepositorio.save(usu);
    }
}