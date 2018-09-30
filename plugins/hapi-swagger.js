// Swagger插件配置
// 在app.js中，通过server.register挂载
const inert = require('inert');
const vision = require('vision');
const packageModule = require('package');
const hapiSwagger = require('hapi-swagger');

module.exports = [
	inert,
	vision,
	{
		register: hapiSwagger,
		options: {
			info: {
				title: '接口文档',
				version: packageModule.version,
			},
			grouping: 'tags',
			tags: [
				{name: 'tests', description: '测试相关'},
				{name: 'orders', description: '订单模块'},
				{name: 'shops', description: '店铺模块'},
			]
		}
	}
];
