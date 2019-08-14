module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      // usuário do agendamento (chave na tabela de usuários)
      user_id: {
        type: Sequelize.INTEGER,
        // chave estrangeira (foreign key)
        references: { model: 'users', key: 'id' },
        // se o usuário for alterado, fazer como que ocorra também dentro da tabela de usuários
        onUpdate: 'CASCADE',
        // mantém o histórico dos agendamentos do cliente, mesmo o usuário não existindo mais
        onDelete: 'SET NULL',
        allowNull: true,
      },
      // provedor do agendamento (chave na tabela de usuários)
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('files');
  },
};
