module.exports = [
	{
		method: 'GET',
		path: '/',
		handler: (request, reply) => {
			reply('hello hapi');
		},
		// 配置hapi-swagger参数。
		// tags第二个参数选填，将接口进行group分组管理
		config: {
			tags: ['api', 'tests'],
			description: '测试hello-hapi'
		}
	},
]