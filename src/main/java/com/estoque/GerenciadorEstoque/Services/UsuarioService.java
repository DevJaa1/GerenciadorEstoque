package com.estoque.GerenciadorEstoque.Services;

import com.estoque.GerenciadorEstoque.Controller.UsuarioController;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.estoque.GerenciadorEstoque.Entidade.Usuario;
import com.estoque.GerenciadorEstoque.Repositorio.UsuarioRepositorio;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {

   
    private final GerenciadorEstoque.Controller.UsuarioController usuarioController;
    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepositorio usuarioRepositorio, PasswordEncoder pass, GerenciadorEstoque.Controller.UsuarioController usuarioController) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordEncoder = pass;
        this.usuarioController = usuarioController;
    }

    // Autenticar usuaario
    @Transactional
    public Usuario autenticarUsuario(String senha, String email) {

        Usuario usuarioAuth = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou senha Inválidos!"));

        if (!usuarioAuth.isContaAtiva()) {
            throw new RuntimeException("Conta se encontra desativada!");
        }

        boolean senhaValida = passwordEncoder.matches(senha, usuarioAuth.getSenhausuario());

        return usuarioAuth;

    }

    // cadastrar usuario
    @Transactional
    public Usuario cadastroUsuario(Usuario usucad) {

        if (usuarioRepositorio.existsByNome(usucad.getNome())) {
            throw new RuntimeException("Nome de usuário já cadastrado!");
        }
        return usuarioRepositorio.save(usucad);
    }

    // buscar usuario pelo nome
    @Transactional
    public Usuario buscarUsuarioNome(String nome) {

        return usuarioRepositorio.findByNome(nome)
                .orElseThrow(() -> new RuntimeException("Usuário nao encontrado"));

    }

    // listar usuarios cadastrados
    @Transactional
    public List<Usuario> listarusuariosregistrados() {
        return usuarioRepositorio.findAll();
    }

    // implementar contador de limite de tentativa
    // recuperação de senha
    // alterar senha do usuario
    @Transactional
    public Usuario alterarSenha(String senhaAtual, String senhaNova, String email) {

        // 1. Busca o usuário pelo e-mail
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
        // 2. Verifica se a conta está bloqueada
        if(!usuario.isContaAtiva()) {
           throw new RuntimeException("Não é possível alterar senha de conta desativada!");
        }
        // 3. Valida se a senha atual está correta
        boolean senhaAtualValida = passwordEncoder.matches(senhaAtual, usuario.getSenhausuario());
        // 4. Garante que a nova senha seja diferente da antiga
        boolean mesmaSenha = passwordEncoder.matches(senhaAtual, senhaNova);
        if(mesmaSenha) {
            throw new RuntimeException("Senha nova deve ser diferente que a senha atual");
        }        
        // 5. Criptografa a nova senha e atualiza o usuário
        String novaSenhaEncript = passwordEncoder.encode(senhaNova);
        usuario.setSenhausuario(novaSenhaEncript);

        return usuarioRepositorio.save(usuario);
    }
    // autenticar usuario com senha nome de usuario
    
    // atualizar dados do usuario
    @Transactional
    public Usuario atualizarCadastro (Long id, Usuario attUsuario){
        
        Usuario usu = usuarioRepositorio.findById(id).
        orElseThrow(()-> new RuntimeException("Usuário não encontrado!"));
        
        if()
        
        
        
        return null;
    }

    // buscarusuario por id
    // inativar usuario por id

}
