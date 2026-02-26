package com.estoque.GerenciadorEstoque.Services;


import com.estoque.GerenciadorEstoque.Entidade.MovimentacaoEstoque;
import com.estoque.GerenciadorEstoque.Entidade.Produto;
import com.estoque.GerenciadorEstoque.Entidade.TipoMovimentacao;
import com.estoque.GerenciadorEstoque.Repositorio.MovimentacaoRepositorio;
import com.estoque.GerenciadorEstoque.Repositorio.ProdutoRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


@Transactional
@Service
public class MovimentacaoService {

    private final MovimentacaoRepositorio movimentacaoRepositorio;
    private final ProdutoRepositorio produtoRepositorio;


    public MovimentacaoService (MovimentacaoRepositorio movimentacaoRepositorio, ProdutoRepositorio produtoRepositorio) {
        this.movimentacaoRepositorio = movimentacaoRepositorio;
        this.produtoRepositorio = produtoRepositorio;
    }

    public MovimentacaoEstoque stockControl (Long idPrd, TipoMovimentacao tipo, Integer amount, String description) {

        Produto prod = produtoRepositorio.findById(idPrd).orElseThrow(() -> new RuntimeException("Product not found"));

        if(!prod.getAtivo()) {
            throw new RuntimeException("Product Inative");
        }

        if(tipo == TipoMovimentacao.SAIDA) {
            prod.exitItem(amount);
        }

        if(tipo == TipoMovimentacao.ENTRADA) {
            prod.entryItem(amount);
        }

        MovimentacaoEstoque mov = new MovimentacaoEstoque();

        mov.setQuantidade(amount);
        mov.setTipo(tipo);
        mov.setProduto(prod);
        mov.setMotivo(description);
        mov.setDataHora(LocalDateTime.now());


        produtoRepositorio.save(prod);
        return movimentacaoRepositorio.save(mov);

    }

}
