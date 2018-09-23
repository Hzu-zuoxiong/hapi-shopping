const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');
const hapiAuthJWT2 = require('hapi-auth-jwt2');
const routerHelloHapi = require('./router/hello-hapi');
const routerShops = require('./router/shops');
const routerOrders = require('./router/orders');
const routerUsers = require('./router/users');
// 引入自定义hapi-swagger、hapi-pagination插件配置
const pluginHapiSwagger = require('./plugins/hapi-swagger');
const pluginHapiPagination = require('./plugins/hapi-pagination');
const pluginHapiAuthJWT2 = require('./plugins/hapi-auth-jwt2');


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
		hapiAuthJWT2,
		...pluginHapiSwagger,
	]);
	pluginHapiAuthJWT2(server);
	// 创建简单的hello hapi接口
	server.route([
		...routerHelloHapi,
		...routerShops,
		...routerOrders,
		...routerUsers,
	]);
	// 启动服务
	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();