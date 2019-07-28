import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs'; // importa módulo BCRYPT para criar senha no formato 'hash'

class User extends Model {
  // método que vai ser chamado automaticamente pelo Sequelize
  static init(sequelize) {
    // chamando o método init da classe Model
    super.init(
      {
        // enviar as colunas que vamos ter na nossa base de dados
        // devemos evitar as colunas que são chaves primárias e chaves estrangeiras e inserir apenas
        // as colunas que são inseridas efetivamente pelo usuário na hora de cadastrar novo usuário
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // campo do tipo VIRTUAL nunca vai existir na base de dados
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // adicionar funcionalidade Hook: trecho de código que rodará automaticamente conforme ações
    // que acontecem no nosso model
    // 'beforeSave': será executado antes de save (criação ou update de usuário)
    // Obs: para usar o await, precisa do async
    this.addHook('beforeSave', async user => {
      if (user.password) {
        // o número 8 indica o número de rounds da criptografia (força da criptografia)
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    // tipo de relacionamento "pertence a"
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
