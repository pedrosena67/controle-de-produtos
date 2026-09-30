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

inputNome.addEventListener('input', verificarPreenchimento);
inputQuantidade.addEventListener('input', verificarPreenchimento);
inputPreco.addEventListener('input', verificarPreenchimento);

if (inputBusca) {
    inputBusca.addEventListener('input', function() {
        renderizarTabela(inputBusca.value.toLowerCase());
    });
}

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

function renderizarTabela(filtro = '') {
    tabela.innerHTML = '';

    const produtosFiltrados = produtos.filter(prod => 
    prod.nome.toLowerCase().includes(filtro) || 
    prod.id.toLowerCase().includes(filtro)
);

    if (produtosFiltrados.length === 0) {
        tabela.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum produto encontrado.</td></tr>';
        return;
    }

    produtosFiltrados.forEach(prod => {
        const tr = document.createElement('tr');

        if (prod.quantidade <= 5) {
            tr.classList.add('estoque-baixo');
        }

        tr.innerHTML = `
            <td>#${prod.id}</td>
            <td>${prod.nome} ${prod.quantidade <= 9 ? '⚠️ (Baixo)' : ''}</td>
            <td>${prod.quantidade}</td>
            <td>R$ ${prod.preco.toFixed(2)}</td>
            <td>
                <button type="button" class="btn-editar" onclick="prepararEdicao('${prod.id}')">Editar</button>
                <button type="button" class="btn-excluir" onclick="excluirProduto('${prod.id}')">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

function prepararEdicao(id) {
    const prod = produtos.find(p => p.id === id);
    if (!prod) return;

    inputId.value = prod.id;
    inputNome.value = prod.nome;
    inputQuantidade.value = prod.quantidade;
    inputPreco.value = prod.preco;

    btnSalvar.innerText = 'Atualizar Produto';
    btnCancelar.style.display = 'inline-block';
}

function atualizarProduto(id, nome, quantidade, preco) {
    const prod = produtos.find(p => p.id === id);
    if (prod) {
        prod.nome = nome;
        prod.quantidade = quantidade;
        prod.preco = preco;
    }
}

function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        produtos = produtos.filter(p => p.id !== id);
        salvarNoLocalStorage();
        renderizarTabela(inputBusca ? inputBusca.value.toLowerCase() : '');
    }
    
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

function limparFormulario() {
    inputId.value = '';
    form.reset();
    btnSalvar.innerText = 'Cadastrar Produto';
    btnCancelar.style.display = 'none';
}


if (btnCancelar) {
    btnCancelar.addEventListener('click', limparFormulario);
}

limparFormulario();
renderizarTabela();