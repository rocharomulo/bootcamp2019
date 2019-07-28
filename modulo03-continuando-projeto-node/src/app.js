import express from 'express'; // import no formato do ES6, usando a dependência SUCRASE
import path from 'path';
import routes from './routes'; // importa as rotas de outro arquivo

import './database'; // importa database/index.js

class App {
  constructor() {
    this.server = express(); // inicializa o express
    // roda os métodos middlewares() e routes() na hora da construção
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // aplicação pode receber requisições no formato json
    // rota para servir arquivos estáticos (no caso, servir a imagem do avatar do usuário)
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // exporta apenas o servidor (Express)
