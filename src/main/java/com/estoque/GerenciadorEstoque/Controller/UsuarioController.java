package com.estoque.GerenciadorEstoque.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.estoque.GerenciadorEstoque.Entidade.Usuario;
import com.estoque.GerenciadorEstoque.Services.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(
    origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS} )

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
    public ResponseEntity<?> cadastrarUsuario(@Valid @RequestBody Usuario usuarionovo) {
    try {
        Usuario usunovo = usuService.cadastroUsuario(usuarionovo);
        return ResponseEntity.status(HttpStatus.CREATED).body(usunovo);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}

    // login de usuario caadasatrdo
    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Usuario usuLogin) {
        try {

            Usuario usuarioAuteticado = usuService.autenticarUsuario(usuLogin.getSenhausuario(), usuLogin.getEmail());
            return ResponseEntity.ok(usuarioAuteticado);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail inválido ou senha incorreta");

        }
    }

    @PutMapping
    public ResponseEntity<Usuario> atualizarCadastro(@Valid @RequestBody Usuario usuarioatt,
            @PathVariable Long id) {

        Usuario usuariodadonovo = usuService.atualizarCadastro(usuarioatt, id);
        return ResponseEntity.ok(usuariodadonovo);

    }

}
