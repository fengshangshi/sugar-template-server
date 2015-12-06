global.sugar = global.s = global.S = {};

// pid
global.pid = s.pid = process.pid;

// root
global.ROOT = s.root = __dirname;
global.APPROOT = s.app = s.root + '/app';
global.COMMONROOT = s.common = s.app + '/common';
global.CONFOOT = s.conf = s.common + '/config';
global.CONTROLLERROOT = s.controller = s.common + '/controller';
global.MIDDLEWAREROOT = s.middleware = s.common + '/middleware';
global.RUNTIMEROOT = s.runtime = s.common + '/runtime';
global.MODELROOT = s.model = s.model + '/model';
global.LIBROOT = s.lib = s.root + '/libs';
global.VIEWROOT = s.view = s.root + '/views';
global.STATICROOT = s.static = s.root + '/static';
global.LOGROOT = s.log = s.root + '/logs';

// lodash
global._ = s._ = require('lodash');

// configs
global.config = s.config = require(s.conf + '/config');
_.defaultsDeep(config, require(s.lib + '/config'));

// libs
global.logger = s.logger = require(s.lib + '/logger');
global.ral = s.ral = require(s.lib + '/ral');

// process event handle
process.on('exit', function() {
		logger.error('服务器停止', {pid: pid});
});

/*
process.on('uncaughtException', function(err) {
		logger.error('服务器出现错误: ' + (err.stack || err), {pid: pid});
});
*/

process.on('SIGINT', function() {
		logger.error('服务器收到信号退出, 准备停止服务', {pid: pid});

		// 日志异步写入
		setTimeout(function() {
				process.exit(1);
		}, 10);
});

var server = require(LIBROOT + '/server');
var port = s.config['server']['port'];
server.listen(port, function() {
		logger.info('服务器启动成功, 工作在端口: ' + port);
});














/*
var _ = require('lodash');
var express = require('express');
var fs = require('fs');




global.S = global.sugar = {};
global.ROOT = S.root = __dirname;

// app root and common root
global.APPROOT = S.app = S.root + '/app';
global.COMMONROOT = S.common = S.app + '/common';

// common config root
global.CONFIGROOT = S.configRoot = S.common + '/config';

// libs root
global.LIBSROOT = S.libs = S.root + '/libs';

// views root
global.VIEWSROOT = S.views = S.root + '/views';
global.STATICROOT = S.static = S.root + '/static';

// libs
global.ral = S.ral = require(S.libs + '/ral');

// common config
var config = require(S.libs + '/config.json');
var commonConfig = require(S.configRoot + '/config.json');
_.assign(config, commonConfig);

global.config = S.config = config;

console.log(global);

return;
var app = express();

app.get('/download', function(req, res) {
		var file = runtime + '/temp1.zip';
		var ws = fs.createWriteStream(file);

		ral('fetch_zip', function(err, data) {
				if (err) {
						console.log(err);
						res.end('Loading file is failed');
				}
				data.pipe(ws);
				res.download(file);
		}, {
				url: 'http://cmyum.corp.qunar.com/mobile_app/fe/asphy/srm_hy/beta/srm_hy-v20151201195214.zip'		
		});
});


app.listen(3000);
*/
