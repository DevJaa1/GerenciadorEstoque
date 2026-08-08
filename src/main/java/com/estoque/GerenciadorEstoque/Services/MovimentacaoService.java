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

    public MovimentacaoEstoque stockControl (Long idPrd, TipoMovimentacao tipo, int quantidade, String description) {

        Produto prod = produtoRepositorio.findById(idPrd).orElseThrow(() -> new RuntimeException("Product not found"));

        if(!prod.getAtivo()) {
            throw new RuntimeException("Product Inative");
        }

        if(tipo == TipoMovimentacao.SAIDA) {
            prod.exitItem(quantidade);
        } else if(tipo == TipoMovimentacao.ENTRADA) {
            prod.entryItem(quantidade);
        }

        MovimentacaoEstoque mov = new MovimentacaoEstoque();

        mov.setQuantidade(quantidade);
        mov.setTipo(tipo);
        mov.setProduto(prod);
        mov.setMotivo(description);
        mov.setDataHora(LocalDateTime.now());


        produtoRepositorio.saveAndFlush(prod);
        return movimentacaoRepositorio.saveAndFlush(mov);

    }

}
