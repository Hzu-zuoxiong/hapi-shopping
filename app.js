const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');
const routesHelloHapi = require('./router/hello-hapi');
const routesShops = require('./router/shops');
const routesOrders = require('./router/orders');
// 引入自定义hapi-swagger、hapi-pagination插件配置
const pluginHapiSwagger = require('./plugins/hapi-swagger');
const pluginHapiPagination = require('./plugins/hapi-pagination');

const server = new Hapi.Server();

// 配置服务
server.connection({
	port: config.port,
	host: config.host,
});

const init = async () => {
	// 为系统使用hapi-swagger
	await server.register([
		pluginHapiPagination,
		...pluginHapiSwagger,
	]);
	// 创建简单的hello hapi接口
	server.route([
		...routesHelloHapi,
		...routesShops,
		...routesOrders,
	]);
	// 启动服务
	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();