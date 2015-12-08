var fs = require('fs');
var path = require('path');
var Sugar = require('ssugar');

var controller = {};
var middleware = {};

function mergeReqParams(req, keys, values) {
		keys = typeof keys === 'string' ? [keys] : keys;
		if (keys.length <= 0 || values.length <= 0) return;

		var params = _.zipObject(keys, values);

		_.merge(req.params, params);
}

function isDir(dir) {
		return fs.existsSync(dir) ? fs.statSync(dir).isDirectory() : false;
}

function scanController(controller, dir, root) {
		if (!!root) { controller = controller[root] = {}; }
		fs.readdirSync(dir).forEach(function(i) {
				var filePath = path.join(dir, i);
				if (isDir(filePath)) {
						controller[i] = {};
						scanController(controller[i], filePath);
				} else if (/\.js$/.test(i)) {
						controller[i.slice(0, -3)] = require(filePath);
						logger.info('loading controller ' + filePath + ' success');
				}
		});
};

function scanMiddleware(middleware, dir) {
		fs.readdirSync(dir).forEach(function(i) {
				var filePath = path.join(dir, i);
				if (/\.js$/.test(i)) {
						middleware[i.slice(0, -3)] = require(filePath);
						logger.info('loading middleware ' + filePath + ' success');
				}
		});
};

function initController(controller, dir) {
		var dirs = fs.readdirSync(dir);
		dirs.forEach(function(i) {
				if (i === 'common') return false;

				var filePath = path.join(dir, i, '/controller');
				if (!fs.existsSync(filePath)) {
						logger.warn(i + '中不存在controller目录');
						return false;
				}

				var isUseModule = config['routeUseModule'] && isDir(filePath);
				if (isUseModule) controller[i] = {};

				var root = isUseModule ? i : false;
				scanController(controller, filePath, root);
		});
}

function initMiddleware(middleware, dir) {
		var dirs = fs.readdirSync(dir);
		dirs.forEach(function(i) {
				if (i === 'common') return false;
				var filePath = path.join(dir, i, 'middleware');
				if (!fs.existsSync(filePath)) {
						logger.warn(i + '中不存在middleware目录');
						return false;
				}

				scanMiddleware(middleware, filePath);
		});
}

function runMiddleware(middlewares, req, res, paths) {
		var isResEnd = 0;
		_.forEach(middlewares, function(i) {
				var fn = middleware[i];
				fn && fn().call(null, req, res, paths) && isResEnd++;
		});
		return isResEnd;
}

function router(cb) {
		initController(controller, APPROOT);
		initMiddleware(middleware, APPROOT);
		Object.freeze(controller);
		Object.freeze(middleware);

		return function(req, res, next) {
				var paths = req.path.substring(1).split('/');
				var routers = controller;
				var method = req.method || 'GET';
				var isExistsRoute = 0;


				while (true) {
						var path = paths.shift();
						if (typeof routers[path] === 'object') {
								routers = routers[path];
								continue;
						}

						if (routers['index'] !== undefined) {
								routers = routers['index'];
						}

						var fn_index = method + '_' + 'index';
						var fn_path = method + '_' + path;

						if (routers && typeof routers[fn_index] === 'function') isExistsRoute += 1;
						if (routers && typeof routers[fn_path] === 'function') isExistsRoute += 2;
						
						switch (isExistsRoute) {
								case 0:
										next('Cannot ' + method + ' ' + req.path);
										break;

								case 1:
										path && paths.unshift(path);
										var params = routers[fn_index].params;
										params && mergeReqParams(req, params, paths);
										paths.unshift(req, res, next);
										var filters = routers[fn_index].filters;
										var isResEnd = filters && runMiddleware(filters, req, res, paths);
										!isResEnd && routers[fn_index].apply(Object.freeze(new Sugar(req)), paths);
										break;
								
								case 2:
								case 3:
										var params = routers[fn_path].params;
										params && mergeReqParams(req, params, paths);
										paths.unshift(req, res, next);
										var filters = routers[fn_path].filters;
										var isResEnd = filters && runMiddleware(filters, req, res, paths);
										!isResEnd && routers[fn_path].apply(Object.freeze(new Sugar(req)), paths);
										break;
						}

						break;
				}
		};
}

module.exports = router;
