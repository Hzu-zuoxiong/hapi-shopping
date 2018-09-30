/*
  
  migrations 目录用于管理数据库表结构迁移的配置目录。初始化完成后目录中暂无内容。
  使用下面命令创建迁移文件
  node_modules/.bin/sequelize migration:create --name create-shops-table
  自动生成的文件里包含up与down两个空函数。
  up用于定义表结构正向改变的细节
  down则用于定义表结构的回退逻辑
*/

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
      'shops',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        thumb_url: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
      },
  ),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('shops'),
};
