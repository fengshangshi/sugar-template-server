/**
 * @file 静态文件
 * @author fengshangshi
 */
var express = require('express');
var server = config['server']['name'];
var support = config['server']['support'];

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['html', 'css', 'js', 'png', 'gif', 'jpg'],
	index: false,
	maxAge: 0,
	lastModified: false,
	redirect: true,
	setHeaders: function(res) {
			res.setHeader('Server', server);
			res.setHeader('X-Powered-By', support);
	}
};

module.exports = function() {
		return express.static(STATICROOT, options);
};
