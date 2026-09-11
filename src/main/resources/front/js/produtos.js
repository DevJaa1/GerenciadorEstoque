document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       0. Menu Mobile (Sidebar)
       ========================================= */
    const menuToggle = document.getElementById('menuToggleBtn');
    const closeMenu = document.getElementById('closeMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (closeMenu && sidebar) {
        closeMenu.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    const API_URL = "http://localhost:8080/produtos";
    const tabelaProdutos = document.getElementById('tabelaProdutos');
    const buscaInput = document.getElementById('buscaProduto');
    
    const filtroTodos = document.getElementById('filtroTodos');
    const filtroBaixa = document.getElementById('filtroBaixa');
    const filtroEsgotados = document.getElementById('filtroEsgotados');

    let todosProdutos = [];
    let filtroAtivo = 'todos';

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
            if (tabelaProdutos) {
                tabelaProdutos.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger);">Não foi possível carregar os produtos do servidor.</td></tr>`;
            }
        }
    }

    // =========================================
    // 2. Renderizar tabela com base nos filtros
    // =========================================
    function renderizarTabela() {
        if (!tabelaProdutos) return;
        tabelaProdutos.innerHTML = '';

        const termoBusca = buscaInput ? buscaInput.value.toLowerCase().trim() : '';

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

        configurarBotoesExclusao();
    }

    // =========================================
    // 3. Evento de exclusão de produtos
    // =========================================
    function configurarBotoesExclusao() {
        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(btn => {
            btn.addEventListener('click', async () => {
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

    // Torna a função acessível no escopo global para atualizar a tabela após cadastro
    window.carregarProdutos = carregarProdutos;

    // Iniciar carregamento
    carregarProdutos();
});

/* =========================================
   5. Funções Globais do Modal de Cadastro
   ========================================= */

function abrirModal() {
    const modal = document.getElementById('modalProduto');
    if (modal) {
        modal.style.display = 'flex';
        carregarCategorias();
        carregarFornecedores();
    }
}

function fecharModal() {
    const modal = document.getElementById('modalProduto');
    const form = document.getElementById('formProduto');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
}

/// Carregar Categorias no Select
// Carregar Categorias no Select
async function carregarCategorias() {
    const select = document.getElementById('categoriaSelect');
    if (!select) return;

    try {
        const response = await fetch('http://localhost:8080/categorias');

        if (!response.ok) throw new Error(`Status HTTP: ${response.status}`);

        const responseData = await response.json();
        
        // Trata se o backend retornar uma lista paginada (Page) ou uma lista simples (List)
        const categorias = responseData.content ? responseData.content : responseData;

        console.log("Categorias processadas:", categorias);

        if (!Array.isArray(categorias) || categorias.length === 0) {
            select.innerHTML = '<option value="">Nenhuma categoria cadastrada</option>';
            return;
        }

        select.innerHTML = '<option value="">Selecione uma categoria...</option>';
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nomeCategoria; // Atributo exato do Categoria.java
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        select.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    }
}

// Carregar Fornecedores no Select
async function carregarFornecedores() {
    const select = document.getElementById('fornecedorSelect');
    if (!select) return;

    try {
        const response = await fetch('http://localhost:8080/fornecedores');

        if (!response.ok) throw new Error(`Status HTTP: ${response.status}`);

        const responseData = await response.json();

        // Trata se o backend retornar uma lista paginada (Page) ou uma lista simples (List)
        const fornecedores = responseData.content ? responseData.content : responseData;

        console.log("Fornecedores processados:", fornecedores);

        if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
            select.innerHTML = '<option value="">Nenhum fornecedor cadastrado</option>';
            return;
        }

        select.innerHTML = '<option value="">Selecione um fornecedor...</option>';
        fornecedores.forEach(forn => {
            const option = document.createElement('option');
            option.value = forn.id;
            option.textContent = forn.nome; // Atributo exato do Fornecedor.java
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
        select.innerHTML = '<option value="">Erro ao carregar fornecedores</option>';
    }
}
/* =========================================
   6. Função para Salvar/Cadastrar Produto
   ========================================= */
async function cadastrarProduto(event) {
    event.preventDefault(); // Impede a página de recarregar

    const categoriaId = document.getElementById('categoriaSelect').value;
    const fornecedorId = document.getElementById('fornecedorSelect').value;

    if (!categoriaId) {
        alert('Por favor, selecione uma categoria.');
        return;
    }

    if (!fornecedorId) {
        alert('Por favor, selecione um fornecedor.');
        return;
    }

    // Estrutura do objeto JSON enviada ao backend
    const produtoData = {
        nomeProduto: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricao').value,
        quantidadeItens: parseInt(document.getElementById('quantidadeItens').value) || 0,
        precoCusto: parseFloat(document.getElementById('precoCusto').value) || 0.0,
        precoVenda: parseFloat(document.getElementById('precoVenda').value) || 0.0,
        ativo: true,
        fornecedor: {
            id: parseInt(fornecedorId)
        }
    };

    // CORREÇÃO: URL ajustada de acordo com o @PostMapping do ProdutoController.java
    const url = `http://localhost:8080/produtos/categorias/${categoriaId}/produtos`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoData)
        });

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            fecharModal();
            if (window.carregarProdutos) {
                window.carregarProdutos(); // Recarrega a tabela de produtos
            }
        } else {
            const erroTxt = await response.text();
            console.error('Erro no servidor:', erroTxt);
            alert('Erro ao cadastrar produto. Verifique se os dados estão corretos.');
        }
    } catch (error) {
        console.error('Erro de rede/conexão:', error);
        alert('Não foi possível conectar ao servidor.');
    }
}