/**
 * @file 中间件加载器
 * @author fengshangshi
 */
var fs = require('fs');
var path = require('path');

var preMiddleware = config['preMiddleware'];
var middleware = config['middleware'];
var middlewares = preMiddleware.concat(middleware);

var defaultPath = LIBROOT + '/middleware';

module.exports = function(app) {
		_.forEach(middlewares, function(m) {
				var filename = m + '.js';
				var defaultMiddleware = path.join(defaultPath, '/', filename);
				var commonMiddleware = path.join(MIDDLEWAREROOT, '/', filename);

				if (fs.existsSync(commonMiddleware)
								&& typeof require(commonMiddleware) === 'function') {
						app.use(require(commonMiddleware)(app));
				} else if (fs.existsSync(defaultMiddleware)
								&& typeof require(defaultMiddleware) === 'function') {
						app.use(require(defaultMiddleware)(app));
				}
		});
};
