const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');
// hapi-auth-jwt2 赋予系统中的部分接口，需要用户登录授权后才能访问
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
	// 插件完成注册之后，需要获取server实例后才能完成最终的配置
	// 引入hapi-auth-jwt插件后，所有接口默认开启JWT认证
	// 如果希望特定接口不通过JWT认证，在router的config定义auth=false的配置
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