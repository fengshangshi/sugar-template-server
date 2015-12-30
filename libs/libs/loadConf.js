/**
 * @file 加载配置
 * @author fengshangshi
 */
var fs = require('fs');
var path = require('path');

module.exports = function(root, mount) {
		fs.readdirSync(root).forEach(function(i) {
				var dir = path.join(root, i);
				if (/^config\./.test(i)) {
						try {
								mount['config'] = require(dir);
						} catch(e) {}
				} else {
						mount['config'] = mount['config'] || {};
						try {
								mount['config'][i.split('.')[0]] = require(dir);
						} catch(e) {}
				}
		});
};
