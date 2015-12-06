var winston = require('winston');
var moment = require('moment');
var fs = require('fs');

// check path is exist
var LOGPATH = LOGROOT + '/app';
fs.existsSync(LOGROOT) || fs.mkdirSync(LOGROOT);
fs.existsSync(LOGPATH) || fs.mkdirSync(LOGPATH);

// log options
var logFile = LOGPATH + '/app_' + moment().format('YYYYMMDD') + '.log';
var options = [
		new winston.transports.File({
				name: 'log',
				level: 'info',
				filename: logFile 
		})
];
if (config['console']) {
		options.push(new winston.transports.Console());
}

// exports
module.exports = new winston.Logger({
		transports: options
});
