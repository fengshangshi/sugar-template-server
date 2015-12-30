/**
 * @file cookie parse
 * @author fengshangshi
 */
var cookieParser = require('cookie-parser');

module.exports = function(app) {
		return cookieParser();
};
