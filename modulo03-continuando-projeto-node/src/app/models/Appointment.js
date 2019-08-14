import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  // método que vai ser chamado automaticamente pelo Sequelize
  static init(sequelize) {
    // chamando o método init da classe Model
    super.init(
      {
        // enviar as colunas que vamos ter na nossa base de dados
        // devemos evitar as colunas que são chaves primárias e chaves estrangeiras e inserir apenas
        // as colunas que são inseridas efetivamente pelo usuário na hora de cadastrar novo usuário
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // cria o relacionamento com a tabela de usuários (dois relacionamentos para a mesma tabela )
  static associate(models) {
    // um usuário marcou o agendamento (as = apelido para o relacionamento)
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    // provedor para cujo atendimento foi marcado (as = apelido para o relacionamento)
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
