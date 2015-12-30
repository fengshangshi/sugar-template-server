/**
 * @file header重写
 * @author fengshangshi
 */
var header = require('connect-header');
var server = config['server']['name'];
var support = config['server']['support'];

module.exports = function(app) {
		app.set('x-powered-by', false);

		return header({
				'Server': server, 
				'X-Powered-By': support
		});
};
