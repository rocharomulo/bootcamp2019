// credenciais para acessar o banco de dados
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    // cria automaticamente campos createdAt e updatedAt na tabela
    timestaps: true,
    // passando para o sequelize que quero utilizar a padronização de nomeclatura de tabelas e colulas
    // através do padrão "underscored"
    underscored: true,
    underscoredAll: true,
  },
};
