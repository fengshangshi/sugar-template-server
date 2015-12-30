/**
 * @file session
 * @author fengshangshi
 */
var session = require('express-session');

module.exports = function(app) {
		return session({
				secret: 'keyboard cat',
				resave: false,
				saveUninitialized: true
		});
};
