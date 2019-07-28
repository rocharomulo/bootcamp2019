module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      // tabela
      'users',
      // novo campo
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        // chave estrangeira (foreign key)
        references: { model: 'files', key: 'id' },
        // se o avatar_id for alterado, fazer como que ocorra também dentro da tabela de usuários
        onUpdate: 'CASCADE',
        // se deletar o id na tabela files, definir o campo avatar_id como nulo
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
