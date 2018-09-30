const { jwtHeaderDefine } = require('../utils/router-helper');

module.exports = [{
	method: 'GET',
	path: '/',
	handler: (request, reply) => {
		console.log(request.auth.credentials);
		reply('hello hapi');
	},
	// 配置hapi-swagger参数。
	// tags第二个参数选填，将接口进行group分组管理
	config: {
		tags: ['api', 'tests'],
		description: '测试hello-hapi',
		validate: {
			// 增加需要jwt auth认证的接口header校验
			...jwtHeaderDefine,
		},
	},
}];