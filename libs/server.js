var express = require('express');
var middleware = require(LIBROOT + '/middleware');
var router = require(LIBROOT + '/router');
var app = express();

// load middleware
middleware(app);

// sugar router
app.use(router());

module.exports = app;
