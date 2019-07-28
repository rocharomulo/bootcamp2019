import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // método que vai ser chamado automaticamente pelo Sequelize
  static init(sequelize) {
    // chamando o método init da classe Model
    super.init(
      {
        // enviar as colunas que vamos ter na nossa base de dados
        // devemos evitar as colunas que são chaves primárias e chaves estrangeiras e inserir apenas
        // as colunas que são inseridas efetivamente pelo usuário na hora de cadastrar novo usuário
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
