package com.estoque.GerenciadorEstoque.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.estoque.GerenciadorEstoque.Entidade.Usuario;
import com.estoque.GerenciadorEstoque.Services.UsuarioService;

import jakarta.validation.Valid;
import lombok.val;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuService = usuarioService;
    }

    // trazer todos os usuarios registrados
    @GetMapping
    public ResponseEntity<List<Usuario>> listaResponseEntity() {

        List<Usuario> listausuarios = usuService.listarusuariosregistrados();
        return ResponseEntity.ok(listausuarios);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario usuId = usuService.buscarPorId(id);

        return ResponseEntity.ok(usuId);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Usuario> buscarUsuarioPorNome(@RequestParam String nome) {
        Usuario usuNome = usuService.buscarUsuarioNome(nome);

        return ResponseEntity.ok(usuNome);
    }

    // cadastrar usuario, sempre neste mapping o 201 created
    @PostMapping
    public ResponseEntity<Usuario> cadastrarUsuario(@Valid @RequestBody Usuario usuarionovo) {
        Usuario usunovo = usuService.cadastroUsuario(usuarionovo);
        return ResponseEntity.status(HttpStatus.CREATED).body(usunovo);

    }

    @PutMapping
    public ResponseEntity<Usuario> atualizarCadastro(@Valid @RequestBody Usuario usuarioatt,
            @PathVariable Long id) {

        Usuario usuariodadonovo = usuService.atualizarCadastro(usuarioatt, id);
        return ResponseEntity.ok(usuariodadonovo);

    }

}
