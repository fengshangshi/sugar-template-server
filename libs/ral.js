var request = require('superagent'); 

/**
 * 加载ral配置
 */
function loadRalConfig(key) {
		var ralPath = S.root + '/app/common/config/ral';
		try {
				var configs = require(ralPath);
				return configs[key] ? configs[key] : {};
		} catch (err) {
				console.log('Loading ral.json failed');
				return {};
		}
}

/**
 * 参数有效性校验
 */
function validParamCheck(type, config) {
		switch (type) {
				case 'http':
						return httpValidCheck(config);
						break;

				case 'mongo':
						return mongoValidCheck(config);
						break;

				case 'mysql':
						return mysqlValidCheck(config);
						break;

				default:
						return false;
		}
}

/**
 * http 访问有效性验证
 */
function httpValidCheck(config) {
		var defaultConfig = {
				upstream: '',
				port: 80,
				method: 'GET',
				timeout: 10
		};

		// default中定义了初始化参数
		return _.assign(defaultConfig, config);
}

/**
 * config ral.json中的具体配置
 * callback 回调函数
 */
module.exports = function(key, callback, options) {
		var config = loadRalConfig(key);
		_.assign(config, options);

		var type = config['type'];
		var check = validParamCheck(type, config);

		if (!check) {
				console.log('ral config is invalid');
				callback(new Error('ral config is invalid'));
		} else {
				// check有参数补充功能，
				// 需要merge到config中
				_.assign(config, check);
				switch (type) {
						case 'http':
								httpRal(config, callback);
								break;
						default:
								callback(new Error('ral type is invalid'));
				}
		}
};


/**
 * ral 统一资源访问层
 */

/**
 * httpRal http资源访问
 */
function httpRal(config, callback) {
		var url = config.url || config.upstream;
		var method = config.method.toLocaleLowerCase();

		console.log(method, url);

		request[method](url)
				.timeout(parseInt(config.timeout) * 1000)
				.end(function(err, res) {
						callback(err, res);
				});
}
