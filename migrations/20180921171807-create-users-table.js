'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'users',
    {
      id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nick_name: Sequelize.STRING,
      avatar_url: Sequelize.STRING,
      gender: Sequelize.INTEGER,
      open_id: Sequelize.STRING,
      session_id: Sequelize.STRING,
      create_at: Sequelize.DATE,
      update_at: Sequelize.DATE,
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('users'),
};
