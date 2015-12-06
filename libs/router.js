var fs = require('fs');
var path = require('path');
var Sugar = require('ssugar');

var controller = {};

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
						logger.info('loading ' + filePath + ' success');
				}
		});
};

function initController(ctrl, dir) {
		var dirs = fs.readdirSync(dir);
		dirs.forEach(function(i) {
				// ignore common
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

function router(cb) {
		initController(controller, APPROOT);
		Object.freeze(controller);

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
										routers[fn_index].params && mergeReqParams(req, routers[fn_index].params, paths);
										paths.unshift(req, res, next);
										routers[fn_index].apply(Object.freeze(new Sugar(req)), paths);
										break;
								
								case 3:
										routers[fn_path].params && mergeReqParams(req, routers[fn_path].params, paths);
										paths.unshift(req, res, next);
										routers[fn_path].apply(Object.freeze(new Sugar(req)), paths);
										break;
						}

						break;
				}
		};
}

module.exports = router;
