/* ========================================================
   StockSys - Dashboard Script (Ações Rápidas 100% Funcionais)
   ======================================================== */

const API_URL = "http://localhost:8080/produtos";
const API_MOVIMENTACOES = "http://localhost:8080/movimentacoes";
const API_CATEGORIAS = "http://localhost:8080/categorias";
const API_FORNECEDORES = "http://localhost:8080/fornecedores";

let produtosCache = [];
let movementChart = null;
let categoryChart = null;

/* ========================================================
   INICIALIZAÇÃO AUTOMÁTICA
   ======================================================== */
function inicializarAcoesRapidas() {
    garantirEstilosModais();
    garantirEstruturaModais();
    vincularBotoesAcoesRapidas();
}

// Executa imediatamente e quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        inicializarAcoesRapidas();
        inicializarComponentesGerais();
        carregarDadosDashboard();
        carregarMovimentacoesDashboard();
    });
} else {
    inicializarAcoesRapidas();
    inicializarComponentesGerais();
    carregarDadosDashboard();
    carregarMovimentacoesDashboard();
}

window.addEventListener('load', () => {
    inicializarAcoesRapidas();
});

/* ========================================================
   VINCULAÇÃO INTELIGENTE DOS BOTÕES DE AÇÕES RÁPIDAS
   ======================================================== */
function vincularBotoesAcoesRapidas() {
    // 1. Vinculação direta por ID
    const btnProd = document.getElementById('btnAcaoProduto');
    if (btnProd) btnProd.onclick = (e) => { e.preventDefault(); abrirModalProduto(); };

    const btnEnt = document.getElementById('btnAcaoEntrada');
    if (btnEnt) btnEnt.onclick = (e) => { e.preventDefault(); abrirModalEntrada(); };

    const btnSai = document.getElementById('btnAcaoSaida');
    if (btnSai) btnSai.onclick = (e) => { e.preventDefault(); abrirModalSaida(); };

    const btnRel = document.getElementById('btnAcaoRelatorio');
    if (btnRel) btnRel.onclick = (e) => { e.preventDefault(); abrirModalRelatorio(); };

    // 2. Vinculação por posição e texto em .actions-grid (independente de IDs ou onclicks no HTML)
    const botoesGrid = document.querySelectorAll('.actions-grid button, .actions-widget button, .actions-grid .btn-action');
    botoesGrid.forEach((btn, index) => {
        const txt = btn.textContent.toLowerCase();
        if (txt.includes('produto') || index === 0) {
            btn.id = 'btnAcaoProduto';
            btn.onclick = (e) => { e.preventDefault(); abrirModalProduto(); };
        } else if (txt.includes('entrada') || index === 1) {
            btn.id = 'btnAcaoEntrada';
            btn.onclick = (e) => { e.preventDefault(); abrirModalEntrada(); };
        } else if (txt.includes('saída') || txt.includes('saida') || index === 2) {
            btn.id = 'btnAcaoSaida';
            btn.onclick = (e) => { e.preventDefault(); abrirModalSaida(); };
        } else if (txt.includes('relatório') || txt.includes('relatorio') || index === 3) {
            btn.id = 'btnAcaoRelatorio';
            btn.onclick = (e) => { e.preventDefault(); abrirModalRelatorio(); };
        }
    });

    // 3. Botão "Ver todos" na tabela de estoque baixo
    const btnVerTodos = document.querySelector('.table-container .btn-primary');
    if (btnVerTodos) {
        btnVerTodos.onclick = () => window.location.href = '../html/produtos.html';
    }
}

/* ========================================================
   AUTO-INJEÇÃO DE MODAIS NO DOM (CASO NÃO EXISTAM NO HTML)
   ======================================================== */
function garantirEstruturaModais() {
    if (document.getElementById('modalNovoProduto')) {
        return; // Já existem no documento
    }

    const container = document.createElement('div');
    container.id = 'containerModaisEstoque';
    container.innerHTML = `
    <!-- Modal 1: Novo Produto -->
    <div id="modalNovoProduto" class="modal">
        <div class="modal-conteudo">
            <div class="modal-header">
                <h2><i class="fa-solid fa-box-open"></i> Novo Produto</h2>
                <button type="button" class="modal-close-btn" onclick="fecharModalProduto()">&times;</button>
            </div>
            <form id="formNovoProduto" onsubmit="salvarProdutoDashboard(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="dashCategoriaSelect">Categoria *</label>
                        <select id="dashCategoriaSelect" required>
                            <option value="">Carregando categorias...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="dashFornecedorSelect">Fornecedor *</label>
                        <select id="dashFornecedorSelect" required>
                            <option value="">Carregando fornecedores...</option>
                        </select>
                    </div>

                    <div class="form-group campo-full">
                        <label for="dashNomeProduto">Nome do Produto *</label>
                        <input type="text" id="dashNomeProduto" placeholder="Ex: Mouse Sem Fio RGB" required>
                    </div>

                    <div class="form-group campo-full">
                        <label for="dashDescricaoProduto">Descrição *</label>
                        <textarea id="dashDescricaoProduto" placeholder="Descrição e especificações do item..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="dashPrecoCusto">Preço de Custo (R$) *</label>
                        <input type="number" step="0.01" min="0.01" id="dashPrecoCusto" placeholder="0,00" required>
                    </div>

                    <div class="form-group">
                        <label for="dashPrecoVenda">Preço de Venda (R$) *</label>
                        <input type="number" step="0.01" min="0.01" id="dashPrecoVenda" placeholder="0,00" required>
                    </div>

                    <div class="form-group campo-full">
                        <label for="dashQuantidadeItens">Estoque Inicial (unidades) *</label>
                        <input type="number" min="0" id="dashQuantidadeItens" placeholder="0" required>
                    </div>

                    <div class="form-group campo-full checkbox-container">
                        <input type="checkbox" id="dashAtivo" checked>
                        <label for="dashAtivo">Produto ativo no sistema</label>
                    </div>
                </div>

                <div class="acoes-modal">
                    <button type="button" class="btn-cancelar" onclick="fecharModalProduto()">Cancelar</button>
                    <button type="submit" class="btn-confirmar"><i class="fa-solid fa-check"></i> Salvar Produto</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal 2: Entrada no Estoque -->
    <div id="modalEntradaEstoque" class="modal">
        <div class="modal-conteudo">
            <div class="modal-header">
                <h2><i class="fa-solid fa-arrow-right-to-bracket" style="color: #10b981;"></i> Registrar Entrada</h2>
                <button type="button" class="modal-close-btn" onclick="fecharModalEntrada()">&times;</button>
            </div>
            <form id="formEntradaEstoque" onsubmit="confirmarEntradaEstoque(event)">
                <div class="form-group">
                    <label for="entradaProdutoSelect">Produto *</label>
                    <select id="entradaProdutoSelect" required onchange="aoMudarProdutoEntrada()">
                        <option value="">Selecione o produto...</option>
                    </select>
                    <div id="entradaEstoqueInfo" class="estoque-info-badge badge-primary" style="display: none;">
                        Estoque atual: <strong id="entradaEstoqueQtd">0</strong> unidades
                    </div>
                </div>

                <div class="form-group">
                    <label for="entradaQuantidade">Quantidade a Adicionar *</label>
                    <input type="number" id="entradaQuantidade" min="1" placeholder="Ex: 10" required>
                </div>

                <div class="form-group">
                    <label for="entradaMotivo">Motivo / Descrição *</label>
                    <input type="text" id="entradaMotivo" list="sugestoesEntrada" placeholder="Ex: Compra de fornecedor, reposição..." required>
                    <datalist id="sugestoesEntrada">
                        <option value="Compra de reposição">
                        <option value="Recebimento de fornecedor">
                        <option value="Devolução de cliente">
                        <option value="Ajuste de inventário positivo">
                    </datalist>
                </div>

                <div class="acoes-modal">
                    <button type="button" class="btn-cancelar" onclick="fecharModalEntrada()">Cancelar</button>
                    <button type="submit" class="btn-confirmar btn-success"><i class="fa-solid fa-arrow-down"></i> Confirmar Entrada</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal 3: Saída do Estoque -->
    <div id="modalSaidaEstoque" class="modal">
        <div class="modal-conteudo">
            <div class="modal-header">
                <h2><i class="fa-solid fa-arrow-right-from-bracket" style="color: #ef4444;"></i> Registrar Saída</h2>
                <button type="button" class="modal-close-btn" onclick="fecharModalSaida()">&times;</button>
            </div>
            <form id="formSaidaEstoque" onsubmit="confirmarSaidaEstoque(event)">
                <div class="form-group">
                    <label for="saidaProdutoSelect">Produto *</label>
                    <select id="saidaProdutoSelect" required onchange="aoMudarProdutoSaida()">
                        <option value="">Selecione o produto...</option>
                    </select>
                    <div id="saidaEstoqueInfo" class="estoque-info-badge badge-warning" style="display: none;">
                        Disponível em estoque: <strong id="saidaEstoqueQtd">0</strong> unidades
                    </div>
                </div>

                <div class="form-group">
                    <label for="saidaQuantidade">Quantidade a Retirar *</label>
                    <input type="number" id="saidaQuantidade" min="1" placeholder="Ex: 5" required oninput="validarQuantidadeSaida()">
                    <small id="saidaErroQtd" style="color: #ef4444; font-weight: 600; display: none; margin-top: 4px;">A quantidade informada excede o estoque disponível!</small>
                </div>

                <div class="form-group">
                    <label for="saidaMotivo">Motivo / Descrição *</label>
                    <input type="text" id="saidaMotivo" list="sugestoesSaida" placeholder="Ex: Venda balcão, baixa..." required>
                    <datalist id="sugestoesSaida">
                        <option value="Venda balcão / pedido">
                        <option value="Avaria / Produto danificado">
                        <option value="Consumo interno / Teste">
                        <option value="Perda / Extravio">
                        <option value="Ajuste de inventário negativo">
                    </datalist>
                </div>

                <div class="acoes-modal">
                    <button type="button" class="btn-cancelar" onclick="fecharModalSaida()">Cancelar</button>
                    <button type="submit" class="btn-confirmar btn-danger" id="btnConfirmarSaida"><i class="fa-solid fa-arrow-up"></i> Confirmar Saída</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal 4: Relatório Geral de Estoque -->
    <div id="modalRelatorio" class="modal">
        <div class="modal-conteudo modal-lg">
            <div class="modal-header">
                <h2><i class="fa-solid fa-file-invoice" style="color: #4f46e5;"></i> Relatório Geral de Estoque</h2>
                <button type="button" class="modal-close-btn" onclick="fecharModalRelatorio()">&times;</button>
            </div>

            <div class="relatorio-acoes-top">
                <span style="font-size: 0.9rem; color: #64748b;">Emitido em: <strong id="relatorioDataHora">--/--/----</strong></span>
                <div class="relatorio-botoes-export">
                    <button type="button" class="btn-export-csv" onclick="exportarRelatorioCSV()"><i class="fa-solid fa-file-excel"></i> Baixar Planilha (CSV)</button>
                    <button type="button" class="btn-print-report" onclick="imprimirRelatorio()"><i class="fa-solid fa-print"></i> Imprimir / Salvar PDF</button>
                </div>
            </div>

            <div class="relatorio-kpis">
                <div class="relatorio-kpi-card">
                    <span>Total Itens</span>
                    <strong id="repTotalProdutos">0</strong>
                </div>
                <div class="relatorio-kpi-card">
                    <span>Unidades Total</span>
                    <strong id="repUnidades">0</strong>
                </div>
                <div class="relatorio-kpi-card">
                    <span>Custo Estimado</span>
                    <strong id="repCustoTotal">R$ 0,00</strong>
                </div>
                <div class="relatorio-kpi-card">
                    <span>Valor de Venda</span>
                    <strong id="repValorVenda">R$ 0,00</strong>
                </div>
                <div class="relatorio-kpi-card">
                    <span>Lucro Projetado</span>
                    <strong id="repLucroProjetado" style="color: #10b981;">R$ 0,00</strong>
                </div>
            </div>

            <div class="relatorio-tabela-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Cód</th>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Estoque</th>
                            <th>Preço Custo</th>
                            <th>Preço Venda</th>
                            <th>Total Venda</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="relatorioTabelaCorpo">
                    </tbody>
                </table>
            </div>

            <div class="acoes-modal">
                <button type="button" class="btn-cancelar" onclick="fecharModalRelatorio()">Fechar</button>
            </div>
        </div>
    </div>

    <!-- Container de Toasts -->
    <div id="toastContainer" class="toast-container"></div>
    `;

    document.body.appendChild(container);
}

/* ========================================================
   AUTO-INJEÇÃO DE ESTILOS CSS
   ======================================================== */
function garantirEstilosModais() {
    if (document.getElementById('estilosModaisStockSys')) return;

    const style = document.createElement('style');
    style.id = 'estilosModaisStockSys';
    style.textContent = `
    .modal {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px);
        display: none; align-items: center; justify-content: center;
        z-index: 10000; padding: 16px; box-sizing: border-box;
    }
    .modal-conteudo {
        background: #ffffff; width: 100%; max-width: 520px; max-height: 90vh;
        overflow-y: auto; padding: 24px 28px; border-radius: 18px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); border: 1px solid #e2e8f0;
        box-sizing: border-box; font-family: inherit;
    }
    .modal-conteudo.modal-lg { max-width: 860px; }
    .modal-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;
    }
    .modal-header h2 { font-size: 1.25rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 10px; margin: 0; }
    .modal-close-btn { background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; padding: 2px 8px; border-radius: 6px; }
    .modal-close-btn:hover { color: #0f172a; background: #f1f5f9; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .campo-full { grid-column: 1 / -1; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #0f172a; }
    .form-group input, .form-group select, .form-group textarea {
        width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 10px;
        font-size: 0.9rem; color: #0f172a; font-family: inherit; background: #f8fafc;
        box-sizing: border-box;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
        outline: none; border-color: #4f46e5; background: #ffffff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }
    .form-group textarea { resize: vertical; min-height: 70px; }
    .checkbox-container { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    .checkbox-container input { width: 18px; height: 18px; cursor: pointer; accent-color: #4f46e5; }
    .checkbox-container label { font-size: 0.875rem; color: #64748b; cursor: pointer; }
    .estoque-info-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; padding: 6px 12px; border-radius: 8px; margin-top: 4px; }
    .badge-primary { background: #eef2ff; color: #4f46e5; }
    .badge-warning { background: #fffbeb; color: #b45309; }
    .acoes-modal { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
    .acoes-modal .btn-cancelar { background: #f1f5f9; color: #64748b; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; }
    .acoes-modal .btn-cancelar:hover { background: #e2e8f0; color: #0f172a; }
    .acoes-modal .btn-confirmar { background: #4f46e5; color: #ffffff; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .acoes-modal .btn-confirmar:hover { background: #4338ca; }
    .acoes-modal .btn-success { background: #10b981; }
    .acoes-modal .btn-success:hover { background: #059669; }
    .acoes-modal .btn-danger { background: #ef4444; }
    .acoes-modal .btn-danger:hover { background: #dc2626; }
    .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; }
    .toast { display: flex; align-items: center; gap: 12px; background: #ffffff; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); font-size: 0.9rem; font-weight: 500; color: #0f172a; min-width: 280px; max-width: 420px; }
    .toast-success { border-left: 4px solid #10b981; }
    .toast-error { border-left: 4px solid #ef4444; }
    .toast-info { border-left: 4px solid #4f46e5; }
    .relatorio-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .relatorio-kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 12px; }
    .relatorio-kpi-card span { font-size: 0.75rem; color: #64748b; display: block; margin-bottom: 4px; text-transform: uppercase; font-weight: 600; }
    .relatorio-kpi-card strong { font-size: 1.15rem; color: #0f172a; }
    .relatorio-acoes-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 10px; flex-wrap: wrap; }
    .relatorio-botoes-export { display: flex; gap: 10px; }
    .btn-export-csv, .btn-print-report { display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; }
    .btn-export-csv { background: #10b981; color: #ffffff; }
    .btn-print-report { background: #3b82f6; color: #ffffff; }
    .relatorio-tabela-wrap { max-height: 340px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff; }
    .relatorio-tabela-wrap table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .relatorio-tabela-wrap th { background: #f8fafc; position: sticky; top: 0; padding: 10px 12px; text-align: left; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; }
    .relatorio-tabela-wrap td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #0f172a; }
    @media print {
        body * { visibility: hidden !important; }
        #modalRelatorio, #modalRelatorio * { visibility: visible !important; }
        #modalRelatorio { position: absolute; left: 0; top: 0; width: 100%; height: auto; background: #ffffff !important; display: block !important; padding: 0; }
        .modal-conteudo { max-width: 100% !important; max-height: none !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .modal-close-btn, .relatorio-botoes-export, .acoes-modal { display: none !important; }
        .relatorio-tabela-wrap { max-height: none !important; overflow: visible !important; }
    }
    `;
    document.head.appendChild(style);
}

/* ========================================================
   SISTEMA DE NOTIFICAÇÃO (TOAST)
   ======================================================== */
function mostrarToast(mensagem, tipo = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;

    let icone = 'fa-circle-check';
    if (tipo === 'error') icone = 'fa-triangle-exclamation';
    if (tipo === 'info') icone = 'fa-circle-info';

    toast.innerHTML = `
        <i class="fa-solid ${icone}"></i>
        <div>${mensagem}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ========================================================
   CARREGAMENTO E ATUALIZAÇÃO DO DASHBOARD
   ======================================================== */
async function carregarDadosDashboard() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.statusText}`);
        }

        const produtos = await resposta.json();
        produtosCache = produtos;
        atualizarDashboard(produtos);
    } catch (erro) {
        console.error("Não foi possível carregar os dados do dashboard:", erro);
        mostrarToast("Erro ao conectar com a API de produtos.", "error");
    }
}

function atualizarDashboard(produtos) {
    const totalProdutos = produtos.length;
    const unidadesEstoque = produtos.reduce((acc, p) => acc + (p.quantidadeItens || 0), 0);
    const estoqueBaixo = produtos.filter(p => (p.quantidadeItens || 0) > 0 && (p.quantidadeItens || 0) < 10).length;
    const produtosEsgotados = produtos.filter(p => (p.quantidadeItens || 0) === 0).length;
    
    const valorEstoqueTotal = produtos.reduce((acc, p) => {
        const qtd = p.quantidadeItens || 0;
        const preco = p.precoVenda ? parseFloat(p.precoVenda) : 0;
        return acc + (qtd * preco);
    }, 0);

    const elTotal = document.getElementById('totalProdutos');
    const elUnidades = document.getElementById('unidadesEstoque');
    const elBaixo = document.getElementById('estoqueBaixo');
    const elEsgotados = document.getElementById('produtosEsgotados');
    const elValor = document.getElementById('valorEstoque');

    if (elTotal) elTotal.textContent = totalProdutos;
    if (elUnidades) elUnidades.textContent = unidadesEstoque;
    if (elBaixo) elBaixo.textContent = estoqueBaixo;
    if (elEsgotados) elEsgotados.textContent = produtosEsgotados;
    
    if (elValor) {
        elValor.textContent = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valorEstoqueTotal);
    }

    const alertaEsgotados = document.getElementById('alertaEsgotadosText');
    if (alertaEsgotados) {
        alertaEsgotados.textContent = `${produtosEsgotados} produtos estão completamente esgotados!`;
    }

    const alertaBaixo = document.getElementById('alertaBaixoText');
    if (alertaBaixo) {
        alertaBaixo.textContent = `${estoqueBaixo} produtos abaixo do estoque mínimo.`;
    }

    const tabelaCorpo = document.getElementById('tabelaEstoqueBaixo');
    if (tabelaCorpo) {
        tabelaCorpo.innerHTML = '';

        const itensBaixos = produtos.filter(p => (p.quantidadeItens || 0) < 10);
        
        if (itensBaixos.length === 0) {
            tabelaCorpo.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #10b981; font-weight: 500; padding: 24px;">✓ Todos os produtos estão com níveis saudáveis de estoque!</td></tr>`;
        } else {
            itensBaixos.forEach(p => {
                const statusClass = p.quantidadeItens === 0 ? 'critical' : 'low';
                const statusText = p.quantidadeItens === 0 ? 'Esgotado' : 'Baixo';
                const catName = p.categoria ? p.categoria.nomeCategoria : 'Sem Categoria';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${p.nomeProduto}</strong></td>
                    <td>${catName}</td>
                    <td><strong style="color: ${p.quantidadeItens === 0 ? '#ef4444' : '#b45309'};">${p.quantidadeItens}</strong></td>
                    <td>10</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button type="button" class="btn-icon" title="Repor Estoque (Registrar Entrada)" onclick="abrirModalEntrada(${p.id})">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </td>
                `;
                tabelaCorpo.appendChild(row);
            });
        }
    }

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

/* ========================================================
   CARREGAMENTO DAS ÚLTIMAS MOVIMENTAÇÕES
   ======================================================== */
async function carregarMovimentacoesDashboard() {
    const lista = document.getElementById('listaUltimasMovimentacoes') || document.querySelector('.bottom-grid .list-group');
    if (!lista) return;

    try {
        const resposta = await fetch(API_MOVIMENTACOES);
        if (!resposta.ok) return;

        const movimentacoes = await resposta.json();
        if (!Array.isArray(movimentacoes) || movimentacoes.length === 0) {
            return;
        }

        lista.innerHTML = '';
        const ultimas = movimentacoes.slice(0, 5);

        ultimas.forEach(m => {
            const isEntrada = m.tipo === 'ENTRADA';
            const iconBg = isEntrada ? 'bg-success' : 'bg-danger';
            const iconClass = isEntrada ? 'fa-arrow-down' : 'fa-arrow-up';
            const valueClass = isEntrada ? 'success' : 'danger';
            const prefix = isEntrada ? '+' : '-';
            const tipoLabel = isEntrada ? 'Entrada' : 'Saída';

            const prodNome = m.produto ? m.produto.nomeProduto : 'Produto';
            
            let dataFormatada = 'Recente';
            if (m.dataHora) {
                const d = new Date(m.dataHora);
                dataFormatada = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
                                d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            }

            const li = document.createElement('li');
            li.className = 'list-item';
            li.innerHTML = `
                <div class="item-icon ${iconBg}"><i class="fa-solid ${iconClass}"></i></div>
                <div class="item-details">
                    <strong>${tipoLabel}</strong> — ${prodNome}
                    <span>${dataFormatada} • ${m.motivo || 'Sem observação'}</span>
                </div>
                <div class="item-value ${valueClass}">${prefix}${m.quantidade}</div>
            `;
            lista.appendChild(li);
        });

    } catch (e) {
        console.warn("Não foi possível carregar as movimentações do banco:", e);
    }
}

/* ========================================================
   AÇÃO RÁPIDA 1: CADASTRAR PRODUTO
   ======================================================== */
function abrirModalProduto() {
    inicializarAcoesRapidas();
    const modal = document.getElementById('modalNovoProduto');
    if (modal) {
        modal.style.display = 'flex';
        carregarCategoriasSelect();
        carregarFornecedoresSelect();
    }
}

function fecharModalProduto() {
    const modal = document.getElementById('modalNovoProduto');
    const form = document.getElementById('formNovoProduto');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
}

async function carregarCategoriasSelect() {
    const select = document.getElementById('dashCategoriaSelect');
    if (!select) return;

    try {
        const resp = await fetch(API_CATEGORIAS);
        if (!resp.ok) throw new Error("Erro ao buscar categorias");
        const data = await resp.json();
        const categorias = data.content ? data.content : data;

        if (!Array.isArray(categorias) || categorias.length === 0) {
            select.innerHTML = '<option value="">Nenhuma categoria encontrada</option>';
            return;
        }

        select.innerHTML = '<option value="">Selecione a categoria...</option>';
        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.nomeCategoria;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error(e);
        select.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    }
}

async function carregarFornecedoresSelect() {
    const select = document.getElementById('dashFornecedorSelect');
    if (!select) return;

    try {
        const resp = await fetch(API_FORNECEDORES);
        if (!resp.ok) throw new Error("Erro ao buscar fornecedores");
        const data = await resp.json();
        const fornecedores = data.content ? data.content : data;

        if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
            select.innerHTML = '<option value="">Nenhum fornecedor encontrado</option>';
            return;
        }

        select.innerHTML = '<option value="">Selecione o fornecedor...</option>';
        fornecedores.forEach(forn => {
            const opt = document.createElement('option');
            opt.value = forn.id;
            opt.textContent = forn.nome;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error(e);
        select.innerHTML = '<option value="">Erro ao carregar fornecedores</option>';
    }
}

async function salvarProdutoDashboard(event) {
    event.preventDefault();

    const categoriaId = document.getElementById('dashCategoriaSelect').value;
    const fornecedorId = document.getElementById('dashFornecedorSelect').value;

    if (!categoriaId) {
        mostrarToast("Selecione uma categoria para o produto!", "error");
        return;
    }
    if (!fornecedorId) {
        mostrarToast("Selecione um fornecedor para o produto!", "error");
        return;
    }

    const novoProduto = {
        nomeProduto: document.getElementById('dashNomeProduto').value.trim(),
        descricao: document.getElementById('dashDescricaoProduto').value.trim(),
        quantidadeItens: parseInt(document.getElementById('dashQuantidadeItens').value) || 0,
        precoCusto: parseFloat(document.getElementById('dashPrecoCusto').value) || 0.0,
        precoVenda: parseFloat(document.getElementById('dashPrecoVenda').value) || 0.0,
        ativo: document.getElementById('dashAtivo').checked,
        fornecedor: {
            id: parseInt(fornecedorId)
        }
    };

    const url = `${API_URL}/categorias/${categoriaId}/produtos`;

    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });

        if (resp.ok) {
            fecharModalProduto();
            mostrarToast(`Produto "${novoProduto.nomeProduto}" cadastrado com sucesso!`, "success");
            await carregarDadosDashboard();
        } else {
            const erroJson = await resp.json().catch(() => ({}));
            const msgErro = erroJson.message || "Erro ao cadastrar produto no servidor.";
            console.error("Erro na criação:", msgErro);
            mostrarToast(msgErro, "error");
        }
    } catch (e) {
        console.error("Erro de rede:", e);
        mostrarToast("Falha de conexão com o servidor.", "error");
    }
}

/* ========================================================
   AÇÃO RÁPIDA 2: REGISTRAR ENTRADA NO ESTOQUE
   ======================================================== */
function abrirModalEntrada(idProdutoPreSelecionado = null) {
    inicializarAcoesRapidas();
    const modal = document.getElementById('modalEntradaEstoque');
    const select = document.getElementById('entradaProdutoSelect');
    if (!modal || !select) return;

    select.innerHTML = '<option value="">Selecione o produto...</option>';
    
    produtosCache.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.nomeProduto} (Estoque: ${p.quantidadeItens || 0} un.)`;
        select.appendChild(opt);
    });

    if (idProdutoPreSelecionado) {
        select.value = idProdutoPreSelecionado;
        aoMudarProdutoEntrada();
    } else {
        const info = document.getElementById('entradaEstoqueInfo');
        if (info) info.style.display = 'none';
    }

    modal.style.display = 'flex';
}

function fecharModalEntrada() {
    const modal = document.getElementById('modalEntradaEstoque');
    const form = document.getElementById('formEntradaEstoque');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
    const info = document.getElementById('entradaEstoqueInfo');
    if (info) info.style.display = 'none';
}

function aoMudarProdutoEntrada() {
    const select = document.getElementById('entradaProdutoSelect');
    const info = document.getElementById('entradaEstoqueInfo');
    const qtdEl = document.getElementById('entradaEstoqueQtd');

    if (!select || !info || !qtdEl) return;

    const prodId = parseInt(select.value);
    const prod = produtosCache.find(p => p.id === prodId);

    if (prod) {
        qtdEl.textContent = prod.quantidadeItens || 0;
        info.style.display = 'inline-flex';
    } else {
        info.style.display = 'none';
    }
}

async function confirmarEntradaEstoque(event) {
    event.preventDefault();

    const select = document.getElementById('entradaProdutoSelect');
    const idPrd = select ? select.value : '';
    const quantidade = parseInt(document.getElementById('entradaQuantidade').value) || 0;
    const motivo = document.getElementById('entradaMotivo').value.trim();

    if (!idPrd) {
        mostrarToast("Selecione um produto para a entrada!", "error");
        return;
    }
    if (quantidade <= 0) {
        mostrarToast("A quantidade deve ser maior que zero!", "error");
        return;
    }

    const prod = produtosCache.find(p => p.id === parseInt(idPrd));
    const nomeProd = prod ? prod.nomeProduto : 'Produto';

    const url = `${API_MOVIMENTACOES}?idPrd=${idPrd}&tipo=ENTRADA&quantidade=${quantidade}&description=${encodeURIComponent(motivo)}`;

    try {
        const resp = await fetch(url, { method: 'POST' });

        if (resp.ok) {
            fecharModalEntrada();
            mostrarToast(`Entrada de ${quantidade} un. de "${nomeProd}" registrada com sucesso!`, "success");
            await carregarDadosDashboard();
            await carregarMovimentacoesDashboard();
        } else {
            const erroJson = await resp.json().catch(() => ({}));
            const erroMsg = erroJson.message || "Não foi possível registrar a entrada.";
            console.error("Erro na entrada:", erroMsg);
            mostrarToast(erroMsg, "error");
        }
    } catch (e) {
        console.error("Erro de rede:", e);
        mostrarToast("Falha de conexão ao registrar entrada.", "error");
    }
}

/* ========================================================
   AÇÃO RÁPIDA 3: REGISTRAR SAÍDA NO ESTOQUE
   ======================================================== */
function abrirModalSaida(idProdutoPreSelecionado = null) {
    inicializarAcoesRapidas();
    const modal = document.getElementById('modalSaidaEstoque');
    const select = document.getElementById('saidaProdutoSelect');
    if (!modal || !select) return;

    select.innerHTML = '<option value="">Selecione o produto...</option>';
    
    produtosCache.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.nomeProduto} (Estoque: ${p.quantidadeItens || 0} un.)`;
        select.appendChild(opt);
    });

    if (idProdutoPreSelecionado) {
        select.value = idProdutoPreSelecionado;
        aoMudarProdutoSaida();
    } else {
        const info = document.getElementById('saidaEstoqueInfo');
        if (info) info.style.display = 'none';
    }

    modal.style.display = 'flex';
}

function fecharModalSaida() {
    const modal = document.getElementById('modalSaidaEstoque');
    const form = document.getElementById('formSaidaEstoque');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
    const info = document.getElementById('saidaEstoqueInfo');
    if (info) info.style.display = 'none';
    const erroQtd = document.getElementById('saidaErroQtd');
    if (erroQtd) erroQtd.style.display = 'none';
}

function aoMudarProdutoSaida() {
    const select = document.getElementById('saidaProdutoSelect');
    const info = document.getElementById('saidaEstoqueInfo');
    const qtdEl = document.getElementById('saidaEstoqueQtd');

    if (!select || !info || !qtdEl) return;

    const prodId = parseInt(select.value);
    const prod = produtosCache.find(p => p.id === prodId);

    if (prod) {
        qtdEl.textContent = prod.quantidadeItens || 0;
        info.style.display = 'inline-flex';
        validarQuantidadeSaida();
    } else {
        info.style.display = 'none';
    }
}

function validarQuantidadeSaida() {
    const select = document.getElementById('saidaProdutoSelect');
    const inputQtd = document.getElementById('saidaQuantidade');
    const erroQtd = document.getElementById('saidaErroQtd');
    const btnSubmit = document.getElementById('btnConfirmarSaida');

    if (!select || !inputQtd || !erroQtd) return;

    const prodId = parseInt(select.value);
    const prod = produtosCache.find(p => p.id === prodId);
    const estoqueAtual = prod ? (prod.quantidadeItens || 0) : 0;
    const qtdDigitada = parseInt(inputQtd.value) || 0;

    if (qtdDigitada > estoqueAtual) {
        erroQtd.style.display = 'block';
        if (btnSubmit) btnSubmit.disabled = true;
    } else {
        erroQtd.style.display = 'none';
        if (btnSubmit) btnSubmit.disabled = false;
    }
}

async function confirmarSaidaEstoque(event) {
    event.preventDefault();

    const select = document.getElementById('saidaProdutoSelect');
    const idPrd = select ? select.value : '';
    const quantidade = parseInt(document.getElementById('saidaQuantidade').value) || 0;
    const motivo = document.getElementById('saidaMotivo').value.trim();

    if (!idPrd) {
        mostrarToast("Selecione um produto para a saída!", "error");
        return;
    }

    const prod = produtosCache.find(p => p.id === parseInt(idPrd));
    const estoqueAtual = prod ? (prod.quantidadeItens || 0) : 0;
    const nomeProd = prod ? prod.nomeProduto : 'Produto';

    if (quantidade <= 0) {
        mostrarToast("A quantidade deve ser maior que zero!", "error");
        return;
    }

    if (quantidade > estoqueAtual) {
        mostrarToast(`Estoque insuficiente! Disponível: apenas ${estoqueAtual} un.`, "error");
        return;
    }

    const url = `${API_MOVIMENTACOES}?idPrd=${idPrd}&tipo=SAIDA&quantidade=${quantidade}&description=${encodeURIComponent(motivo)}`;

    try {
        const resp = await fetch(url, { method: 'POST' });

        if (resp.ok) {
            fecharModalSaida();
            mostrarToast(`Saída de ${quantidade} un. de "${nomeProd}" registrada!`, "success");
            await carregarDadosDashboard();
            await carregarMovimentacoesDashboard();
        } else {
            const erroJson = await resp.json().catch(() => ({}));
            const erroMsg = erroJson.message || "Erro ao registrar saída de estoque.";
            console.error("Erro na saída:", erroMsg);
            mostrarToast(erroMsg, "error");
        }
    } catch (e) {
        console.error("Erro de rede:", e);
        mostrarToast("Falha de conexão ao registrar saída.", "error");
    }
}

/* ========================================================
   AÇÃO RÁPIDA 4: RELATÓRIO GERAL DE ESTOQUE
   ======================================================== */
function abrirModalRelatorio() {
    inicializarAcoesRapidas();
    const modal = document.getElementById('modalRelatorio');
    if (!modal) return;

    const dataHoraEl = document.getElementById('relatorioDataHora');
    if (dataHoraEl) {
        dataHoraEl.textContent = new Date().toLocaleString('pt-BR');
    }

    const totalItens = produtosCache.length;
    const totalUnidades = produtosCache.reduce((acc, p) => acc + (p.quantidadeItens || 0), 0);
    
    const custoTotal = produtosCache.reduce((acc, p) => {
        const qtd = p.quantidadeItens || 0;
        const custo = p.precoCusto ? parseFloat(p.precoCusto) : 0;
        return acc + (qtd * custo);
    }, 0);

    const valorVendaTotal = produtosCache.reduce((acc, p) => {
        const qtd = p.quantidadeItens || 0;
        const preco = p.precoVenda ? parseFloat(p.precoVenda) : 0;
        return acc + (qtd * preco);
    }, 0);

    const lucroProjetado = valorVendaTotal - custoTotal;

    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const elRepTot = document.getElementById('repTotalProdutos');
    const elRepUni = document.getElementById('repUnidades');
    const elRepCus = document.getElementById('repCustoTotal');
    const elRepVen = document.getElementById('repValorVenda');
    const elRepLuc = document.getElementById('repLucroProjetado');

    if (elRepTot) elRepTot.textContent = totalItens;
    if (elRepUni) elRepUni.textContent = totalUnidades;
    if (elRepCus) elRepCus.textContent = formatBRL(custoTotal);
    if (elRepVen) elRepVen.textContent = formatBRL(valorVendaTotal);
    if (elRepLuc) elRepLuc.textContent = formatBRL(lucroProjetado);

    const tabelaCorpo = document.getElementById('relatorioTabelaCorpo');
    if (tabelaCorpo) {
        tabelaCorpo.innerHTML = '';

        if (produtosCache.length === 0) {
            tabelaCorpo.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;">Nenhum produto cadastrado no catálogo.</td></tr>`;
        } else {
            produtosCache.forEach(p => {
                const qtd = p.quantidadeItens || 0;
                let statusClass = 'ok';
                let statusText = 'Adequado';

                if (qtd === 0) {
                    statusClass = 'critical';
                    statusText = 'Esgotado';
                } else if (qtd < 10) {
                    statusClass = 'low';
                    statusText = 'Baixo';
                }

                const catName = p.categoria ? p.categoria.nomeCategoria : 'Sem Categoria';
                const custo = p.precoCusto ? parseFloat(p.precoCusto) : 0;
                const venda = p.precoVenda ? parseFloat(p.precoVenda) : 0;
                const totalVenda = qtd * venda;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>#${p.id}</strong></td>
                    <td>${p.nomeProduto}</td>
                    <td>${catName}</td>
                    <td>${qtd} un.</td>
                    <td>${formatBRL(custo)}</td>
                    <td>${formatBRL(venda)}</td>
                    <td><strong>${formatBRL(totalVenda)}</strong></td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                `;
                tabelaCorpo.appendChild(tr);
            });
        }
    }

    modal.style.display = 'flex';
}

function fecharModalRelatorio() {
    const modal = document.getElementById('modalRelatorio');
    if (modal) modal.style.display = 'none';
}

function exportarRelatorioCSV() {
    if (!produtosCache || produtosCache.length === 0) {
        mostrarToast("Não há produtos para exportar no relatório!", "error");
        return;
    }

    const cabecalhos = [
        "Código",
        "Produto",
        "Categoria",
        "Fornecedor",
        "Quantidade em Estoque",
        "Preço de Custo (R$)",
        "Preço de Venda (R$)",
        "Valor Total de Venda (R$)",
        "Status"
    ];

    const linhas = [];
    linhas.push(cabecalhos.join(";"));

    produtosCache.forEach(p => {
        const qtd = p.quantidadeItens || 0;
        let status = "Adequado";
        if (qtd === 0) status = "Esgotado";
        else if (qtd < 10) status = "Estoque Baixo";

        const cat = p.categoria ? p.categoria.nomeCategoria : "Sem Categoria";
        const forn = p.fornecedor ? p.fornecedor.nome : "Sem Fornecedor";
        const custo = p.precoCusto ? parseFloat(p.precoCusto).toFixed(2).replace('.', ',') : "0,00";
        const venda = p.precoVenda ? parseFloat(p.precoVenda).toFixed(2).replace('.', ',') : "0,00";
        const total = (qtd * (p.precoVenda ? parseFloat(p.precoVenda) : 0)).toFixed(2).replace('.', ',');

        const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

        linhas.push([
            escapeCSV(p.id),
            escapeCSV(p.nomeProduto),
            escapeCSV(cat),
            escapeCSV(forn),
            qtd,
            escapeCSV(custo),
            escapeCSV(venda),
            escapeCSV(total),
            escapeCSV(status)
        ].join(";"));
    });

    const conteudoCSV = "\uFEFF" + linhas.join("\r\n");
    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    const dataISO = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `relatorio_estoque_${dataISO}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    mostrarToast("Planilha CSV de relatório baixada com sucesso!", "success");
}

function imprimirRelatorio() {
    window.print();
}

/* ========================================================
   COMPONENTES GERAIS (SIDEBAR, FILTROS, GRÁFICOS)
   ======================================================== */
function inicializarComponentesGerais() {
    const menuToggle = document.getElementById('menuToggleBtn');
    const closeMenu = document.getElementById('closeMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.onclick = () => sidebar.classList.add('open');
    }
    if (closeMenu && sidebar) {
        closeMenu.onclick = () => sidebar.classList.remove('open');
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.onclick = (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        };
    });

    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#64748b';
        Chart.defaults.borderColor = '#f1f5f9';
        Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, sans-serif";

        const movementChartCtx = document.getElementById('movementChart');
        if (movementChartCtx && !movementChart) {
            movementChart = new Chart(movementChartCtx, {
                type: 'line', 
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Movimentações',
                        data: [450, 600, 500, 800, 700, 1100, 950],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.08)',
                        borderWidth: 2.5,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#4f46e5',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        const categoryChartCtx = document.getElementById('categoryChart');
        if (categoryChartCtx && !categoryChart) {
            categoryChart = new Chart(categoryChartCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
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
}

// Exportações Globais
window.abrirModalProduto = abrirModalProduto;
window.fecharModalProduto = fecharModalProduto;
window.salvarProdutoDashboard = salvarProdutoDashboard;

window.abrirModalEntrada = abrirModalEntrada;
window.fecharModalEntrada = fecharModalEntrada;
window.aoMudarProdutoEntrada = aoMudarProdutoEntrada;
window.confirmarEntradaEstoque = confirmarEntradaEstoque;

window.abrirModalSaida = abrirModalSaida;
window.fecharModalSaida = fecharModalSaida;
window.aoMudarProdutoSaida = aoMudarProdutoSaida;
window.validarQuantidadeSaida = validarQuantidadeSaida;
window.confirmarSaidaEstoque = confirmarSaidaEstoque;

window.abrirModalRelatorio = abrirModalRelatorio;
window.fecharModalRelatorio = fecharModalRelatorio;
window.exportarRelatorioCSV = exportarRelatorioCSV;
window.imprimirRelatorio = imprimirRelatorio;
window.carregarDadosDashboard = carregarDadosDashboard;
window.mostrarToast = mostrarToast;
window.garantirEstruturaModais = garantirEstruturaModais;
window.vincularBotoesAcoesRapidas = vincularBotoesAcoesRapidas;