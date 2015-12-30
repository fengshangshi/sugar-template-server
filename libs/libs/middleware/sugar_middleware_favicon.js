/**
 * @file favicon
 */
var favicon = require('serve-favicon');
var icon = LIBROOT + '/favicon.ico';
if (config['favicon']) {
		icon = STATICROOT + '/' + config['favicon'];
}

module.exports = function() {
		return favicon(icon);
};
