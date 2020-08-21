// server.js
var express = require('express');
// eslint-disable-next-line no-unused-vars
var path = require('path');
var serveStatic = require('serve-static');
var app = express();
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 8080;
app.listen(port);
console.log('server started '+ port);