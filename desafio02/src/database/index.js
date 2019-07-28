// realizar conexão com o banco de dados e carregar os nossos models
import Sequelize from 'sequelize';

// importa os models
import User from '../app/models/User';

import databaseConfig from '../config/database';

// array com todos os users da minha aplicação
const models = [User];

class Database {
  constructor() {
    // chama o próprio método init
    this.init();
  }

  // faz a conexão com a base de dados e carragar nossos models
  init() {
    // aqui eu tenho a minha conexão com a base de dados
    this.connection = new Sequelize(databaseConfig);

    // percorrer o array de usuários
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
