/**
 * @file 加载model
 * @author fengshangshi
 */
var fs = require('fs');
var path = require('path');

module.exports = function(root, mount) {
    fs.readdirSync(root).forEach(function(i) {
        var dir = path.join(root, i);

        mount['model'] = mount['model'] || {};
        try {
            mount['model'][i.split('.')[0]] = require(dir);
        } catch (e) {}

    });
};
