/**
 * @file access log middleware
 * @author fengshangshi
 */
var morgan = require('morgan');
var stream = require('file-stream-rotator');

var logFile = LOGROOT + '/access_%DATE%.log';
var accessStream = stream.getStream({
		filename: logFile,
		date_format: 'YYYYMMDD',
		frequency: 'daily',
		verbose: false
});

module.exports = function() {
		return morgan('combined', {stream: accessStream});
};
