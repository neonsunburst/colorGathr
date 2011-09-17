
/**
 * Module dependencies.
 */

var express = require('express'),
    fs      = require('fs'),
    mu      = require('mu2')
    util    = require('util'),
    http    = require('http'),
    couch   = require('couch-client');

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
  
  // Couchdb stuff
  // var colors = couch('http://dylanbathurst:macosx42@dylan.couchone.com:5984/colorgathr');

  // colors.get('56b9b01098e0ca32d67a8dbc54000bda', function(err, doc) {
  //   if (err) throw err;

  //   console.log(doc);
  // });
  var buffer = '';
  var options = {
    host: 'openapi.etsy.com',
    port: 80,
    // path: '/v2/listings/active?limit=5&color=000000&api_key=7e55a71jhqrwd9w7fa8ohdzu'
    path: '/v2/listings/active?limit=5&color=[0,0,0]&includes=MainImage&api_key=7e55a71jhqrwd9w7fa8ohdzu'
  };

  http.get(options, function(response) {
    res.writeHead(200, {
      'content-type': 'text/html'
    });

    response.on('data', function(chunk) {
      buffer += chunk;
    }).on('end', function () {
      var view = JSON.parse(buffer);

      view.username = randomString();

      mu.root = __dirname + '/views/';

      mu.compile('index.html', function (err, parsed) {
        if (err) {
          throw error;
        };

        var readableStream = mu.render('index.html', view);

        util.pump(readableStream, res, function (err) {
          throw err;
        });
      });

    }).on('error', function(e) {
      console.log('AHHHHHHH');  
    });
  });

  function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 6;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
  }

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
