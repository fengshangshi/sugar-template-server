/**
 * @file hbs模板
 * @author fengshangshi
 */
var viewEngineConfig = config['viewEngine'];
var viewEngine = require(viewEngineConfig);

module.exports = function(app) {
		app.set('views', VIEWROOT);
		app.set('view engine', 'html');
		app.engine('html', viewEngine.__express);

		return function(req, res, next) {
				next();
		};
};
