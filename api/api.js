// Dados JSON armazenados em uma variável
const jsonData = {
  "nome": "Maria",
  "idade": 30,
  "endereco": {
    "cidade": "São Paulo",
    "estado": "SP"
  }
};

// Acessando os dados
console.log(jsonData.nome);            // Maria
console.log(jsonData.idade);           // 30
console.log(jsonData.endereco.cidade); // São Paulo