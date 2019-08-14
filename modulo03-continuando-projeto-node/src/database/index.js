// realizar conexão com o banco de dados e carregar os nossos models
import Sequelize from 'sequelize';

// importa os models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

// array com todos os models da minha aplicação
const models = [User, File, Appointment];

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
    models
      .map(model => model.init(this.connection))
      // só executa caso método model.associate exista dentro do model
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
