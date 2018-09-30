/*

	hapi-auth-jwt2插件配置

*/
const config = require('../config');

// decoded 为JWT payload 被解码后的数据
const validate = (decoded, request, callback) => {
	let error;
	const {userId} = decoded;

	if(!userId) {
		return callback(error, false, userId);
	}
	const credentials = {
		userId,
	};
	// 路由接口的handle通过request.auth.credentials获取jwt decoded的值
	return callback(error, true, credentials);
}


module.exports = (server) => {
	server.auth.strategy('jwt', 'jwt', {
		key: config.jwtSecret,
		validateFunc: validate
	});
	server.auth.default('jwt');
};