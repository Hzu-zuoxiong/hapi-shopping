const Joi = require('joi');
const xml2js = require('xml2js');
const axios = require('axios');
const crypto = require('crypto');
const models = require('../models');
const config = require('../config');
const { jwtHeaderDefine } = require('../utils/router-helper');

const GROUP_NAME = 'orders';

module.exports = [
	{
		method: 'POST',
		path: `/${GROUP_NAME}`,
		handler: async (request, reply) => {
			await models.sequelize.transaction((t) => {
				const result = models.orders.create(
					{user_id: request.auth.credentials.userId},
					{transaction: t},
				).then((order) => {
					const goodsList = [];
					request.payload.goodsList.forEach((item) => {
						goodsList.push(models.order_goods.create({
							order_id: order.dataValues.id,
							goods_id: item.goods_id,
							single_price: 4.9,
							count: item.count,
						}));
					});
					return Promise.all(goodsList);
				});
				return result;
			}).then(() => {
				reply('success');
			}).catch(() => {
				reply('error');
			});
		},
		config: {
			tags: ['api', GROUP_NAME],
			description: '创建订单',
			validate: {
				payload: {
					goodsList: Joi.array().items(
						Joi.object().keys({
							goods_id: Joi.number().integer(),
							count: Joi.number().integer()
						}),
					),
				},
				...jwtHeaderDefine,
			}
		}
	}, {
		method: 'POST',
		path: `/${GROUP_NAME}/{orderId}/pay`,
		handler: async (request, reply) => {
			// 从用户表中获取openid
			const user = await models.users.findOne({where: {id: request.auth.credentials.userId}});
			const {openid} = user;
			// 构造unifiedorder所需入参
			const unifiedorderObj = {
				// 小程序id
				appid: config.wxAppid,
				// 商品简单描述
				body: '小程序支付',
				// 商户号
				mch_id: config.wxMchid，
				// 随机字符串
				nonce_str:Math.random().toString(36).substr(2, 15),
				// 支付成功的回调地址
				notify_url: 'http://127.0.0.1:3000/orders/pay/notify'
				// 用户openid
				openid,
				// 商户订单号
				out_trade_no: request.params.orderId,
				// 调用支付接口的用户ip
				spbill_create_ip: request.info.remoteAddress,
				// 总金额，单位为分
				total_free: 50000,
				// 交易类型，默认
				trade_type: 'JSAPI',
			}
			// 签名的数据
			const getSignData = (rawData, apiKey) => {
				let keys = Object.keys(rawData);
				keys = keys.sort();
				let string = '';
				keys.forEach((key) => {
					string += `&${key}=${rawData[key]}`;
				});
				string = string.substr(1);
				return crypto.createHash('md5').update(`${string}&key=${apiKey}`).digest('hex').toUpperCase();
			};

			// 将基础数据信息sign签名
			const sign = getSignData(unifiedorderObj, config.wxPayApiKey);

			// 需要被post的数据源
			const unifiedorderWithSign = {
				...unifiedorderObj,
				sign,
			};

			// 将需要post出去的订单参数，转换为xml格式
			const builder = new xml2js.Builder({rootName:'xml', headless: true});
			const unifiedorderXML = builder.buildObject(unifiedorderWithSign);
			const result = await axios({
				url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
				method: 'POST',
				data: unifiedorderXML,
				headers: {'content-type': 'text/xml'},
			});

			// result是一个xml结构的response，转换为jsonObject，并返回前端
			xml2js.parseString(result.data, (err, parsedResult) => {
				if(parsedResult.xml) {
					if(parsedResult.xml.return_code[0] === 'SUCCESS' && parsedResult.xml.result_code[0] === 'SUCCESS') {
						// 待签名的原始支付数据
						const replyData = {
							appId: parsedResult.xml.appid[0],
							timeStamp: (Date.now()/1000).toString(),
							nonceStr: parsedResult.xml.nonce_str[0],
							package:`prepay_id=${parsedResult.xml.prepay_id[0]}`,
							signType: 'MD5',
						};
						replyData.paySign = getSignData(replyData, config.wxApiKey);
						reply(replyData);
					}
				}
			});
		},
		config: {
			tags: ['api', GROUP_NAME],
			description: '支付某条订单',
			validate: {
				params: {
					orderId: Joi.string().required(),
				}
			}
		},
	}, {

		/*	
			商户应答成功返回的数据结构：
			<xml>
			  <return_code><![CDATA[SUCCESS]]></return_code>
			  <return_msg><![CDATA[OK]]></return_msg>
			</xml>

		*/
		method: 'POST',
		path: `/${GROUP_NAME}/pay/notify`,
		handler: async (request, reply) => {
			xml2js.parseString(request.payloadm async(err, parsedResult) => {
				if(parsedResult.xml.return_code[0] === 'SUCCESS') {
					// 微信同一支付状态成功，需要检验本地数据的逻辑一致性
					// 省略。。。细节逻辑校验
					// 更新该订单编号下的支付状态为已支付
					const orderId = parsedResult.xml.out_trade_no[0];
					const orderResult = await models.orders.findOne({where: {id: orderId}});
					orderResult.payment_status = '1';
					await orderResult.save();
					const retVal = {
						return_code: 'SUCCESS',
						return_msg: 'OK',
					};
					const builder = new xml2js.Builder({
						rootName: 'xml',
						headless: true,
					});
					reply(builder.buildObject(retVal));
				}
			});
		},
		config: {
			tags: ['api', GROUP_NAME],
			description: '微信支付成功的消息推送',
			auth: false,
		},
	}
];