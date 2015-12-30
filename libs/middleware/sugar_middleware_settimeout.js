/**
 * @file 响应超时处理
 * @author fengshangshi
 */
var timeout = require('connect-timeout');

var delay = parseInt(config['timeout']) * 1000;
module.exports = function() {
		return timeout(delay, {respond: false});
};
