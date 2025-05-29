async function buscarProdutos() {
  try {
    const response = await fetch('produtos.json');
    const produtos = await response.json();

    const tabelaBody = document.querySelector('#tabela-produtos tbody');

    produtos.forEach(produto => {
      const novaLinha = document.createElement('tr');
      const nomeCelula = document.createElement('td');
      const precoCelula = document.createElement('td');

      nomeCelula.textContent = produto.nome;
      precoCelula.textContent = `R$ ${produto.preco.toFixed(2)}`;

      novaLinha.appendChild(nomeCelula);
      novaLinha.appendChild(precoCelula);
      tabelaBody.appendChild(novaLinha);
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

buscarProdutos();