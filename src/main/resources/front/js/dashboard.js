document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Menu Mobile (Sidebar)
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

    /* =========================================
       2. Lógica dos Botões de Filtro
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    /* =========================================
       3. Configuração dos Gráficos (Chart.js)
       ========================================= */
    let movementChart = null;
    let categoryChart = null;

    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#b3b3b3';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
        Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        Chart.defaults.animation = { duration: 500 };

        // Gráfico de Movimentação (inicialmente com dados exemplo)
        const movementChartCtx = document.getElementById('movementChart');
        if (movementChartCtx) {
            movementChart = new Chart(movementChartCtx, {
                type: 'line', 
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Movimentações',
                        data: [450, 600, 500, 800, 700, 1100, 950],
                        borderColor: '#8a70ff',
                        backgroundColor: 'rgba(138, 112, 255, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        // Gráfico de Categoria
        const categoryChartCtx = document.getElementById('categoryChart');
        if (categoryChartCtx) {
            categoryChart = new Chart(categoryChartCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#8a70ff',
                            '#00b894',
                            '#fdcb6e',
                            '#e17055',
                            '#0984e3',
                            '#d63031'
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    }

    /* =========================================
       4. Integração com o Backend API
       ========================================= */
    const API_URL = "http://localhost:8080/produtos";

    async function carregarDadosDashboard() {
        try {
            const resposta = await fetch(API_URL);
            if (!resposta.ok) {
                throw new Error(`Erro na API: ${resposta.statusText}`);
            }

            const produtos = await resposta.json();
            atualizarDashboard(produtos);
        } catch (erro) {
            console.error("Não foi possível carregar os dados do dashboard:", erro);
        }
    }

    function atualizarDashboard(produtos) {
        // 1. Cálculos de métricas
        const totalProdutos = produtos.length;
        const unidadesEstoque = produtos.reduce((acc, p) => acc + (p.quantidadeItens || 0), 0);
        const estoqueBaixo = produtos.filter(p => (p.quantidadeItens || 0) > 0 && (p.quantidadeItens || 0) < 10).length;
        const produtosEsgotados = produtos.filter(p => (p.quantidadeItens || 0) === 0).length;
        
        const valorEstoqueTotal = produtos.reduce((acc, p) => {
            const qtd = p.quantidadeItens || 0;
            const preco = p.precoVenda ? parseFloat(p.precoVenda) : 0;
            return acc + (qtd * preco);
        }, 0);

        // 2. Atualizar textos na interface
        document.getElementById('totalProdutos').textContent = totalProdutos;
        document.getElementById('unidadesEstoque').textContent = unidadesEstoque;
        document.getElementById('estoqueBaixo').textContent = estoqueBaixo;
        document.getElementById('produtosEsgotados').textContent = produtosEsgotados;
        
        document.getElementById('valorEstoque').textContent = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valorEstoqueTotal);

        // 3. Atualizar Tabela de Estoque Baixo (produtos < 10 unidades)
        const tabelaCorpo = document.getElementById('tabelaEstoqueBaixo');
        if (tabelaCorpo) {
            tabelaCorpo.innerHTML = ''; // Limpa tabela

            const itensBaixos = produtos.filter(p => (p.quantidadeItens || 0) < 10);
            
            if (itensBaixos.length === 0) {
                tabelaCorpo.innerHTML = `<tr><td colspan="6" style="text-align: center;">Nenhum produto com estoque baixo!</td></tr>`;
            } else {
                itensBaixos.forEach(p => {
                    const statusClass = p.quantidadeItens === 0 ? 'critical' : 'low';
                    const statusText = p.quantidadeItens === 0 ? 'Esgotado' : 'Baixo';
                    const catName = p.categoria ? p.categoria.nomeCategoria : 'Sem Categoria';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${p.nomeProduto}</td>
                        <td>${catName}</td>
                        <td>${p.quantidadeItens}</td>
                        <td>10</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td><button class="btn-icon"><i class="fa-solid fa-cart-plus"></i></button></td>
                    `;
                    tabelaCorpo.appendChild(row);
                });
            }
        }

        // 4. Atualizar gráfico de Categorias dinamicamente
        if (categoryChart) {
            const categoriasContagem = {};
            produtos.forEach(p => {
                const catName = p.categoria ? p.categoria.nomeCategoria : 'Sem Categoria';
                categoriasContagem[catName] = (categoriasContagem[catName] || 0) + (p.quantidadeItens || 0);
            });

            const labels = Object.keys(categoriasContagem);
            const data = Object.values(categoriasContagem);

            categoryChart.data.labels = labels;
            categoryChart.data.datasets[0].data = data;
            categoryChart.update();
        }
    }

    // Inicializar carregamento
    carregarDadosDashboard();
});