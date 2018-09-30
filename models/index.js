/*
  models 目录用于定义数据库表结构对应关系的模块目录，sequelize-cli自动生成Index.js文件
  该模块自动读取config/config.js中的数据库连接配置，动态加载未来在models目录中所增加的数据库表结构定义的模块
  最终可以通过models.tableName.operations的形式展开一系列的数据库表操作行为。
*/

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configs = require('../config/config.js');
const config = {
  ...configs[env],
  define: {
    underscored: true,
  },
};
const db = {};

let sequelize = null;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
