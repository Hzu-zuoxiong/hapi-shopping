const JWT = require('jsonwebtoken');
const config = require('../config');
const models = require('../models');
const decryptData = require('../utils/decrypted-data');
const axios = require('axios');
const Joi = require('joi');

const GROUP_NAME = 'users';

module.exports = [{
	method: 'POST',
	path: `/${GROUP_NAME}/createJWT`,
	handler: async (request, reply) => {
		const generateJWT = (jwtInfo) => {
			const payload = {
				userId: jwtInfo.userId,
				exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
			};
			return JWT.sign(payload, config.jwtSecret);
		};
		reply(generateJWT({userId: 1}));
	},
	config: {
		tags: ['api', GROUP_NAME],
		description: '用于测试的用户JWT签发',
		auth: false
	},
}, {
	method: 'POST',
	path: `/${GROUP_NAME}/wxLogin`,
	handler: async (req, reply) => {
		const appid = config.wxAppid;
		const secret = config.wxSecret;
		const {code, encryptedData, iv} = req.payload;
		// 通过微信接口获取 openid 与 session_key
		const response = await axios({
			url: 'https://api.weixin.qq.com/sns/jscode2session',
			method: 'GET',
			params: {
				appid,
				secret,
				js_code: code,
				grant_type: 'authorization_code',
			}
		});

		const {openid, session_key} = response.data;

		// 基于 openid 查找或创建一个用户
		const user = await modes.users.findOrCreate({
			where: {open_id: openid},
		});

		// decrypt 解码用户i洗脑洗
		const userInfo = decryptData(encryptedData, iv, sessionKey, appid);

		// 更新 uesr 表中的用户信息
		await models.users.update({
			nick_name: userInfo.nickName,
			gender: userInfo.gender,
			avatar_url: userInfo.avatarUrl,	
			open_id: openid,
			session_key: sessionKey,
		}, {
			where: {open_id: openid},
		});

		// 签发 JWT
		const generateJWT = (jwtInfo) => {
			const payload = {
				userId: jwtInfo.userId,
				exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
			};
			return JWT.sign(payload, config.jwtSecret);
		};

		reply(generateJWT({
			userId: user[0].id,
		}));
	},
	config: {
		// 不需要用户验证
		auth:false,
		tags: ['api', GROUP_NAME],
		description: '微信用户登录测试',
		validate: {
			payload: {
				code: Joi.string().required().description('微信用户登录的临时code'),
				encryptedData: Joi.string().required().description('微信用户信息encryptedData'),
				iv: Joi.string().required().description('微信用户信息iv'),
			},
		},
	},
}];
