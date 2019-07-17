const express = require("express"); // importando o express

const server = express(); // criando a aplicação (o express exporta uma função)
// já foi criado os ervidor Node (uma API)

server.use(express.json()); // avisando ao servidor que vamos usar formato JSON nas requisições ao servidor

// CRIA UM ARRAY PARA OS PROJETOS, já contendo um primeiro projeto

const projects = [
  {
    id: "1",
    title: "Novo Projeto",
    tasks: ["Nova Tarefa"]
  }
];

let contador = 0; // contador de requisições

// MIDDLEWARES

// MIDDLEWARE GLOBAL - para todas as requisições (rotas), este middleware vai ser chamado
// neste caso, ele é um interceptador
server.use((req, res, next) => {
  contador++; // incrementa contador de requisições

  console.log(`Requisição: ${contador}`);

  next(); // faz com que o servidor prossiga no fluxo da aplicação, sem bloquear o servidor
});

// MIDDLEWARE LOCAL - verifiaca se o id do projeto existe
function checkIdExists(req, res, next) {
  const id = req.params.id;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Id does not exist" });
  }

  req.project = project;

  return next(); // caso exista o indice no array, segue o fluxo do servidor
}

// ROTAS

// POST 1
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project); // users é um array, posso usar o método push para inserir um item no array

  return res.json(project);
});

// POST 2
server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(req.project);
});

// DELETA USUÁRIO COM BASE NO NÚMERO DO INDICE

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.project;

  const projectIndex = projects.findIndex(p => p.id === id);

  console.log(`Id: ${id}`); // imprime no log do console o id que será deletado

  projects.splice(projectIndex, 1); // deleta 1 item do array na posição do índice

  return res.send();
});

// GET - LISTA TODOS PROJETOS DO ARRAY
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// PUT (Update noa array com base no número do índice)

server.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

// agora, o servidor precisa ouvir alguma porta
// nosso servidor vai ouvir a porta 3000
server.listen(3000);
