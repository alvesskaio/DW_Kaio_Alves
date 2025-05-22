// Dados JSON como string
const jsonString = '{"nome": "Carlos", "idade": 25, "cidade": "Rio de Janeiro"}';

// Transformando em objeto JavaScript
const jsonData = JSON.parse(jsonString);

// Acessando os dados
console.log(jsonData.nome); // Carlos
console.log(jsonData.idade); // 25