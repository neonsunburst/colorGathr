
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
  
  var buffer = '';
  var options = {
    host: 'openapi.etsy.com',
    port: 80,
    // path: '/v2/listings/active?limit=5&color=000000&api_key=7e55a71jhqrwd9w7fa8ohdzu'
    path: '/v2/listings/active?limit=5&color=[0,0,0]&includes=MainImage&api_key=7e55a71jhqrwd9w7fa8ohdzu'
  };

  var view = JSON.parse(buffer);

  view.username = randyString;


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

  // http.get(options, function(response) {
  //   var randyString = '',
  //       cookie;

  //   if (req.headers.cookie) {
  //     cookie = req.headers.cookie.split('=');
  //   }

  //   if (cookie && cookie[0] == 'username') {
  //     randyString = cookie[1];
  //   } else {
  //     randyString = randomString();
  //   }

  //   res.writeHead(200, {
  //     'content-type': 'text/html',
  //     'set-cookie': 'username=' + randyString 
  //   });

  //   response.on('data', function(chunk) {
  //     buffer += chunk;
  //   }).on('end', function () {

  //   }).on('error', function(e) {
  //     console.log('AHHHHHHH');  
  //   });
  // });

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

app.post('/collect', function(req, res) {

  var user = couch('http://dylanbathurst:macosx42@dylan.couchone.com:5984/colorgathr'),
      form = req.body;
      console.log(req.body),
      cookie = req.headers.cookie.split('=');
  

  // this gets the new user
  user.get(form['new-code'], function(err, doc) {
    if (err) throw err;

    var newItems = doc.items;

    // this gets the currently playing user
    user.get(cookie[1], function(err, doc) {
      if (err) throw err;

      var newObj = merge_options(newItems, doc.items);

      var newDoc = {"_id": cookie[1], "items": newObj};

      user.save(newDoc, function(err, doc) {
        if (err) throw err;

        res.writeHead(302, {
          'Location': '/'  
        });
        res.end();
      });

    });
    
  });

  function merge_options(obj1,obj2){
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
  }
  
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
