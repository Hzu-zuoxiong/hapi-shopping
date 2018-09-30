const Joi = require('joi');
const models = require('../models');
const { paginationDefine } = require('../utils/router-helper');

const GROUP_NAME = 'shops';

module.exports = [{
		method: 'GET',
		path: `/${GROUP_NAME}`,
		handler: async (request, reply) => {
			// 返回的列表与总条数分别存放在 rows 与 count 字段的对象中
			const { rows: results, count: totalCount } = await models.shops.findAndCountAll({
				attributes: ['id', 'name',],
				limit: request.query.limit,
				offset: (request.query.page - 1) * request.query.limit,
			});
			reply({ results, totalCount });
		},
		config: {
			tags: ['api', GROUP_NAME],
			description: '获取店铺列表',
			validate: {
				query: {
					...paginationDefine,
				},
			},
			// 不通过JWT验证
			auth: false,
		},
	}, {
		method: 'GET',
		path: `/${GROUP_NAME}/{shopId}/goods`,
		handler: async (request, reply) => {
			const {row: results, count: totalCount} = await models.goods.findAndCountAll({
				where: {
					shop_id: request.params.shopId,
				},
				attributes: ['id', 'name'],
				limit: request.query.limit,
				offset: (request.query.page - 1) * request.query.limit,
			});
			reply({results, totalCount});
		},
		config: {
			// 免JWT验证
			auth: false,
			tags: ['api', GROUP_NAME],
			description: '获取店铺的商品列表',
			validate: {
				params: {
					shopId: Joi.string().required().description('店铺的ID'),
				},
				query: {
					...paginationDefine,
				},
			},
		},
	},
];