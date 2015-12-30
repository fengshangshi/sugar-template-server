/**
 * @file body parse
 * @author fengshangshi
 */
var bodyParser = require('body-parser');

module.exports = function(app) {
		return bodyParser.json();
};
