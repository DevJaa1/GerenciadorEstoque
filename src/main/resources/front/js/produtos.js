document.addEventListener('DOMContentLoaded', () => {
    
    const API_URL = "http://localhost:8080/produtos";
    const tabelaProdutos = document.getElementById('tabelaProdutos');
    const buscaInput = document.getElementById('buscaProduto');
    
    const filtroTodos = document.getElementById('filtroTodos');
    const filtroBaixa = document.getElementById('filtroBaixa');
    const filtroEsgotados = document.getElementById('filtroEsgotados');

    let todosProdutos = [];
    let filtroAtivo = 'todos'; // 'todos', 'baixa', 'esgotados'

    // =========================================
    // 1. Carregar produtos do Backend
    // =========================================
    async function carregarProdutos() {
        try {
            const resposta = await fetch(API_URL);
            if (!resposta.ok) {
                throw new Error("Erro ao buscar produtos.");
            }
            todosProdutos = await resposta.json();
            renderizarTabela();
        } catch (erro) {
            console.error("Erro de conexão com o servidor:", erro);
            tabelaProdutos.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger);">Não foi possível carregar os produtos do servidor.</td></tr>`;
        }
    }

    // =========================================
    // 2. Renderizar tabela com base nos filtros
    // =========================================
    function renderizarTabela() {
        if (!tabelaProdutos) return;
        tabelaProdutos.innerHTML = '';

        const termoBusca = buscaInput.value.toLowerCase().trim();

        // Aplicar filtros
        let produtosFiltrados = todosProdutos.filter(p => {
            const matchBusca = p.nomeProduto.toLowerCase().includes(termoBusca) || 
                               (p.descricao && p.descricao.toLowerCase().includes(termoBusca));
            
            const qtd = p.quantidadeItens || 0;
            if (filtroAtivo === 'baixa') {
                return matchBusca && qtd > 0 && qtd < 10;
            } else if (filtroAtivo === 'esgotados') {
                return matchBusca && qtd === 0;
            }
            return matchBusca;
        });

        if (produtosFiltrados.length === 0) {
            tabelaProdutos.innerHTML = `<tr><td colspan="7" style="text-align: center;">Nenhum produto cadastrado ou encontrado.</td></tr>`;
            return;
        }

        produtosFiltrados.forEach(p => {
            const qtd = p.quantidadeItens || 0;
            let statusClass = 'ok';
            let statusText = 'Adequado';

            if (qtd === 0) {
                statusClass = 'critical';
                statusText = 'Esgotado';
            } else if (qtd < 10) {
                statusClass = 'low';
                statusText = 'Estoque Baixo';
            }

            const precoFormatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(p.precoVenda || 0);

            const catName = p.categoria ? p.categoria.nomeCategoria : 'Sem Categoria';
            const fornecedorName = p.fornecedor ? p.fornecedor.nomeFornecedor || 'Desconhecido' : 'Sem Fornecedor';

            // Escolha de ícone baseado no nome do produto para manter a estética
            let iconClass = 'fa-box';
            const nomeLower = p.nomeProduto.toLowerCase();
            if (nomeLower.includes('laptop') || nomeLower.includes('notebook') || nomeLower.includes('computador')) {
                iconClass = 'fa-laptop';
            } else if (nomeLower.includes('mouse')) {
                iconClass = 'fa-mouse';
            } else if (nomeLower.includes('teclado')) {
                iconClass = 'fa-keyboard';
            } else if (nomeLower.includes('camisa') || nomeLower.includes('roupa')) {
                iconClass = 'fa-shirt';
            } else if (nomeLower.includes('tenis') || nomeLower.includes('sapato')) {
                iconClass = 'fa-shoe-prints';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${p.id}</td>
                <td>
                    <div class="product-cell">
                        <div class="product-img"><i class="fas ${iconClass}"></i></div>
                        <div class="product-info">
                            <span class="name">${p.nomeProduto}</span>
                            <span class="brand">${fornecedorName}</span>
                        </div>
                    </div>
                </td>
                <td>${catName}</td>
                <td>${qtd} un.</td>
                <td>${precoFormatted}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn-icon" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-excluir" data-id="${p.id}" style="color: var(--danger);"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tabelaProdutos.appendChild(tr);
        });

        // Configurar botões de exclusão
        configurarBotoesExclusao();
    }

    // =========================================
    // 3. Evento de exclusão de produtos
    // =========================================
    function configurarBotoesExclusao() {
        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.getAttribute('data-id');
                if (confirm(`Deseja realmente excluir o produto #${id}?`)) {
                    try {
                        const resposta = await fetch(`${API_URL}/${id}`, {
                            method: 'DELETE'
                        });

                        if (resposta.ok) {
                            alert("Produto excluído com sucesso!");
                            carregarProdutos();
                        } else {
                            alert("Não foi possível excluir o produto.");
                        }
                    } catch (erro) {
                        console.error("Erro ao deletar:", erro);
                        alert("Erro de conexão ao tentar excluir.");
                    }
                }
            });
        });
    }

    // =========================================
    // 4. Configuração dos Eventos de Filtro e Busca
    // =========================================
    function alterarFiltroAtivo(novoFiltro, btnClicado) {
        filtroAtivo = novoFiltro;
        
        // Atualizar classes dos botões
        [filtroTodos, filtroBaixa, filtroEsgotados].forEach(b => {
            if (b) b.classList.remove('active');
        });
        if (btnClicado) btnClicado.classList.add('active');

        renderizarTabela();
    }

    if (filtroTodos) filtroTodos.addEventListener('click', (e) => alterarFiltroAtivo('todos', e.target));
    if (filtroBaixa) filtroBaixa.addEventListener('click', (e) => alterarFiltroAtivo('baixa', e.target));
    if (filtroEsgotados) filtroEsgotados.addEventListener('click', (e) => alterarFiltroAtivo('esgotados', e.target));

    if (buscaInput) {
        buscaInput.addEventListener('input', () => {
            renderizarTabela();
        });
    }

    // Iniciar carregamento
    carregarProdutos();
});
