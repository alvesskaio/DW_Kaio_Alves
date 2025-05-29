// Criando um novo elemento div
const card = document.createElement('div');
card.classList.add('card'); // Adicionando uma classe para estilização

// Criando elementos internos do card
const titulo = document.createElement('h2');
titulo.textContent = 'Produto X';

const descricao = document.createElement('p');
descricao.textContent = 'Descrição do produto.';

const imagem = document.createElement('img');
imagem.src = 'caminho/para/imagem.jpg';
imagem.alt = 'Imagem do produto';

// Adicionando os elementos internos ao card
card.appendChild(titulo);
card.appendChild(descricao);
card.appendChild(imagem);

// Selecionando o elemento onde o card será inserido
const container = document.getElementById('container');

// Adicionando o card ao container
container.appendChild(card);