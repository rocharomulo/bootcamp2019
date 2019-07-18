const express = require("express"); // importando o express

const server = express(); // criando a aplicação (o express exporta uma função)
// já foi criado os ervidor Node (uma API)

server.use(express.json()); // avisando ao servidor que vamos usar formato JSON nas requisições ao servidor

// Query parms = ?teste=1
// Route parms = /users/1
// Request body = { "name": "Romulo", "email": "romulo@gmail.com" }

const users = ["Romulo", "Alessandro", "Wanderson", "Hércules"];

// MIDDLEWARE GLOBAL - para todas as requisições (rotas), este middleware vai ser chamado
// neste caso, ele é um interceptador
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método ${req.method}; URL: ${req.url}`);

  next(); // faz com que o servidor prossiga no fluxo da aplicação, sem bloquear o servidor

  console.timeEnd("Request");
});

// MIDDLEWARE LOCAL - retorna uma mensagem caso esteja faltando o atributo "nome" no body
function checkUserExists(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  req.user = user;

  return next(); // caso exista o indice no array, segue o fluxo do servidor
}

// MIDDLEWARE LOCAL - verifica se o nome que está sendo passado na rota realmente existe no array
function checkUserInArray(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next(); // caso exista o campo "user", segue o fluxo do servidor
}

// criando rotas
// localhost:3000/teste
server.get("/teste", (req, res) => {
  // passa uma função com o código do que o servidor deve fazer quando usuário acessa essa rota

  const nome = req.query.nome; // busca o valor em: http://localhost:3000/teste?nome=Romulo

  return res.json({ message: `Hello ${nome}` });
});

// localhost:3000/users/12345
server.get("/clientes/:id", checkUserExists, (req, res) => {
  // passa uma função com o código do que o servidor deve fazer quando usuário acessa essa rota

  // const id = req.params.id; // busca o valor de id em req.params
  const { id } = req.params; // desestruração do ES6! faz o mesmo que a linha de codigo acima!
  return res.json({ message: `Buscando o cliente ${id}` });
});

// CRUD Completo - Create, Read, Update, Delete

// LISTA TODOS OS USUARIOS DO ARRAY
server.get("/users", (req, res) => {
  return res.json(users);
});

// INSERE UM ITEM NO ARRAY
server.post("/users", (req, res) => {
  const { name } = req.body;

  users.push(name); // users é um array, posso usar o método push para inserir um item no array

  return res.json(users);
});

// UPDATE NOS DADOS DO USUÁRIO COM  BASE NO NÚMERO DO INDICE

server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// DELETA USUÁRIO COM BASE NO NÚMERO DO INDICE

server.delete("/users/:index", checkUserExists, (req, res) => {
  const { index } = req.project;

  users.splice(index, 1); // deleta 1 item do array na posição do índice

  return res.send();
});

// RETORNA UM ÚNICO USUÁRIO
// localhost:3000/users/12345
server.get("/users/:index", checkUserExists, (req, res) => {
  // passa uma função com o código do que o servidor deve fazer quando usuário acessa essa rota
  return res.json(req.user);
});

// agora, o servidor precisa ouvir alguma porta
// nosso servidor vai ouvir a porta 3000
server.listen(3000);
