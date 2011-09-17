
/**
 * Module dependencies.
 */

var express = require('express'),
    fs      = require('fs'),
    mu      = require('mu2')
    util    = require('util');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){

  var view = view || {};

  mu.root = __dirname + '/views/';

  res.writeHead(200, {
    'content-type': 'text/html'
  });

  mu.compile('index.html', function (err, parsed) {
    if (err) {
      exports.error(res, 404, 'error compiling template');
      return;
    };

    var readableStream = mu.render('index.html', view);

    util.pump(readableStream, res, function (err) {
      throw err;
    });
  });

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
