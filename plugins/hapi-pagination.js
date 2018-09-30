/*

	分页插件 hapi-pagination@1
	options具体参数配置说明：https://github.com/fknop/hapi-pagination/tree/v1.6.5

*/
const hapiPagination = require('hapi-pagination');

const options = {
	query: {
		page: {
			name: 'page',
			default: 1,
		},
		limit: {
			name: 'limit',
			default: 25,
		},
		pagination: {
			name: 'pagination',
			default: true,
		},
		invalid: 'defaults',
	},
	meta: {
		name: 'meta',
		count: {
			active: true,
			name: 'count',
		},
		totalCount: {
			active: true,
			name: 'totalCount',
		},
		pageCount: {
			active: true,
			name: 'pageCount',
		},
		self: {
			active: true,
			name: 'self',
		},
		previous: {
			active: true,
			name: 'previous',
		},
		next: {
			active: true,
			name: 'next',
		},
		first: {
			active: true,
			name: 'first',
		},
		last: {
			active: true,
			name: 'last',
		},
		page: {
			active: false,
		},
		limit: {
			active: false,
		},
	},
	results: {
		name: 'results',
	},
	reply: {
		paginate: 'paginate',
	},
	routes: {
		include: [
			'/shops',
			'/shops/{shopId}/goods',
		],
		exclude: [],
	},
};

module.exports = {
	register: hapiPagination,
	options,
};