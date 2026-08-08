package com.estoque.GerenciadorEstoque.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estoque.GerenciadorEstoque.Entidade.Usuario;
import com.estoque.GerenciadorEstoque.Services.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuService = usuarioService;
    }

    // trazer todos os usuarios registrados
    @GetMapping
    public ResponseEntity <List<Usuario>> listaResponseEntity() {

        List<Usuario> listausuarios = usuService.listarusuariosregistrados();
        return ResponseEntity.ok(listausuarios);

    }
    
    //cadastrar usuario
    @PostMapping
    public ResponseEntity <Usuario> cadastrarUsuario (@RequestBody Usuario usuarionovo) {
        Usuario usunovo = usuService.cadastroUsuario(usuarionovo);

        return ResponseEntity.ok(usunovo);

    }
}
