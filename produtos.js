let produtos = JSON.parse(localStorage.getItem('produtos_estoque')) || [];

const form = document.getElementById('form-produto');
const inputId = document.getElementById('produto-id');
const inputNome = document.getElementById('nome');
const inputQuantidade = document.getElementById('quantidade');
const inputPreco = document.getElementById('preco');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const tabela = document.getElementById('tabela-produtos');
const inputBusca = document.getElementById('input-busca');

if (inputBusca) {
    inputBusca.addEventListener('input', function() {
        renderizarTabela(inputBusca.value.toLowerCase());
    });
}

function verificarPreenchimento() {
    const temTexto = inputNome.value.trim() !== '' || 
                     inputQuantidade.value !== '' || 
                     inputPreco.value !== '';

    if (temTexto) {
        btnCancelar.style.display = 'inline-block';
    } else if (!inputId.value) { 
        btnCancelar.style.display = 'none';
    }
}

inputNome.addEventListener('input', verificarPreenchimento);
inputQuantidade.addEventListener('input', verificarPreenchimento);
inputPreco.addEventListener('input', verificarPreenchimento);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = inputId.value;
    const nome = inputNome.value.trim();
    const quantidade = parseInt(inputQuantidade.value);
    const preco = parseFloat(inputPreco.value);

    if (id) {
        atualizarProduto(id, nome, quantidade, preco);
    } else {
        cadastrarProduto(nome, quantidade, preco);
    }

    salvarNoLocalStorage();
    limparFormulario();
    renderizarTabela();
});

function cadastrarProduto(nome, quantidade, preco) {
    const novoProduto = {
        id: Date.now().toString().slice(-6),
        nome: nome,
        quantidade: quantidade,
        preco: preco
    };
    produtos.push(novoProduto);
}

function salvarNoLocalStorage() {
    localStorage.setItem('produtos_estoque', JSON.stringify(produtos));
}

function atualizarResumo() {
    const elTotalQuantidade = document.getElementById('total-quantidade');
    const elTotalValor = document.getElementById('total-valor');

    const totalQuantidade = produtos.reduce((acc, prod) => acc + Number(prod.quantidade), 0);
    const totalValor = produtos.reduce((acc, prod) => acc + (Number(prod.quantidade) * Number(prod.preco)), 0);

    if (elTotalQuantidade && elTotalValor) {
        elTotalQuantidade.innerText = totalQuantidade;
        elTotalValor.innerText = `R$ ${totalValor.toFixed(2)}`;
    }
}

function renderizarTabela(filtro = '') {
    atualizarResumo();

    tabela.innerHTML = '';

    const produtosFiltrados = produtos.filter(prod => 
        prod.nome.toLowerCase().includes(filtro) || 
        prod.id.toLowerCase().includes(filtro)
    );

    if (produtosFiltrados.length === 0) {
        tabela.innerHTML = '<tr><td colspan="5">Nenhum produto encontrado.</td></tr>';
        return;
    }
    produtosFiltrados.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.nome}</td>
            <td>${prod.quantidade}</td>
            <td>R$ ${prod.preco.toFixed(2)}</td>
            <td>
                <button onclick="editarProduto('${prod.id}')">Editar</button>
                <button onclick="excluirProduto('${prod.id}')">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

function prepararEdicao(id) {
    const produto = produtos.find(prod => prod.id === id);
    if (!produto) return;

    inputId.value = produto.id;
    inputNome.value = produto.nome;
    inputQuantidade.value = produto.quantidade;
    inputPreco.value = produto.preco;
     
    btnSalvar.innerText = 'Atualizar Produto';
    btnCancelar.style.display = 'inline-block';
}

function atualizarProduto(id, nome, quantidade, preco) {
    const prod = produtos.find(prod => prod.id === id);
    if (prod) {
        prod.nome = nome;
        prod.quantidade = quantidade;
        prod.preco = preco;
    }
}

function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        produtos = produtos.filter(prod => prod.id !== id);
        salvarNoLocalStorage();
        renderizarTabela(inputBusca ? inputBusca.value.toLowerCase() : '');
    }
}

function limparFormulario() {
    inputId.value = '';
    inputNome.value = '';
    inputQuantidade.value = '';
    inputPreco.value = '';
    btnSalvar.innerText = 'Cadastrar Produto';
    btnCancelar.style.display = 'none';
}  

if (btnCancelar) {
    btnCancelar.addEventListener('click', limparFormulario);
}

limparFormulario();
renderizarTabela();