// realizar conexão com os bancos de dados e carregar os nossos models
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

// importa os models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

// array com todos os models da minha aplicação
const models = [User, File, Appointment];

class Database {
  constructor() {
    // chama método que inicializa database SQL
    this.init();
    // chama método que inicializa MongoDB
    this.mongo();
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

  mongo() {
    this.mongo.connection = mongoose.connect(
      // acessa a base de dados de nome 'gobarber', próprio Mongo cria a base automaticamente
      'mongodb://localhost:27017/gobarber',
      // informa que estamos usando um novo formato de URL para o mongo, que não era usado antigamente
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
