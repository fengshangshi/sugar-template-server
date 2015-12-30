/**
 * @file body parse urlencode
 * @author fengshangshi
 */
var bodyParser = require('body-parser');

module.exports = function(app) {
		return bodyParser.urlencoded({extended: true})
};
