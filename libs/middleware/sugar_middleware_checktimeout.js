/**
 * @file 检查请求是否超时
 * @author fengshangshi
 */
var delay = (parseInt(config['timeout']) + 1) * 1000;
module.exports = function() {
		return function(req, res, next) {
				setTimeout(function() {
						if (req.timedout) {
								var path = req.path;
								var method = req.method;
								logger.error(method + ' ' + path + ' 响应超时[' + delay + 'ms]', {pid: pid});
								res.status(503);
								res.end('Sorry, timeout');
						}
				}, delay);
				next();
		};
};
