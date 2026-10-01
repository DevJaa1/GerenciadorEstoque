package com.estoque.GerenciadorEstoque.Controller;

import com.estoque.GerenciadorEstoque.Entidade.MovimentacaoEstoque;
import com.estoque.GerenciadorEstoque.Entidade.TipoMovimentacao;
import com.estoque.GerenciadorEstoque.Services.MovimentacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimentacoes")
@CrossOrigin(origins = "*")
public class MovimentacaoEstoqueController {

    private final MovimentacaoService movimentacaoService;

    public MovimentacaoEstoqueController(MovimentacaoService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    @GetMapping
    public ResponseEntity<List<MovimentacaoEstoque>> listAll() {
        return ResponseEntity.ok(movimentacaoService.listAll());
    }

    /**
     * Endpoint para registrar uma nova movimentação de estoque.
     * Este método aciona a atualização da quantidade no Produto via back-end.
     */
    @PostMapping
    public ResponseEntity<MovimentacaoEstoque> createStockMovement(
            @RequestParam Long idPrd,
            @RequestParam TipoMovimentacao tipo,
            @RequestParam int quantidade,
            @RequestParam String description) {

        // Chama o método stockControl que você definiu no Service
        MovimentacaoEstoque novaMovimentacao = movimentacaoService.stockControl(
                idPrd, 
                tipo, 
                quantidade, 
                description
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(novaMovimentacao);
    }
}