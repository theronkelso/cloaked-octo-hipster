//The MIT License (MIT)

//Copyright (c) 2014 Theron Kelso

//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

var myVersion = '0.07'; myProductName = 'hellobot';

var fs = require ("fs");
var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./hellobot');
var firebase = require('firebase');

var hellobotPrefs = {
  myPort: process.env.PORT || 3000,
  firebaseUrl: 'https://amber-inferno-3633.firebaseio.com/users'
};

var hellobotStats = {
  ctCalls: 0,
  whenLastStart: new Date (0)
};

var fb = new firebase(hellobotPrefs.firebaseUrl);
var fnameStats = 'perfs/stats.json';

var app = express();

function jsonStringify (jstruct) {
  return (JSON.stringify (jstruct, undefined, 4));
}

function writeStats (fname, stats) {
//  var f = getFullFilePath (fname);
//  fsSureFilePath (f, function () {
    fs.writeFile (fname, jsonStringify (stats), function (err) {
      if (err) {
        console.log ("writeStats: error == " + err.message);
      }
  //  });
  });
}

//body parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req, res, next){
  console.log('Time: %d', Date.now());
  hellobotStats.ctCalls++;
  writeStats (fnameStats, hellobotStats);
  next();
});

//test route
app.get('/', function (req,res) {
  //  fb.child('name').once('value', function(snapshot){
  fb.once('value', function(snapshot){
    console.log(snapshot.val());
    res.setHeader('Content-Type', 'text/plain');
    for (var name in snapshot.val()){
      var obj = snapshot.val()[name];
      for (var prop in obj){
        if (obj.hasOwnProperty(prop)){
          res.write(obj[prop] + '\n');
        }
      }
    }

    res.end();
  }, function (errorObject){
    console.log('the read failed: ' + errorObject.code);
  });
});

app.post('/hello', hellobot);

app.get('/version', function(req,res){
  res.setHeader('Content-Type', 'text/plain');
  res.end('Version ' + myVersion + ' of ' + myProductName + '.\n');
});

app.get('/status', function(req,res){
  res.setHeader('Content-Type', 'text/plain');
  res.end('Calls: ' + hellobotStats.ctCalls + '.\n' +
          'Last start: ' + hellobotStats.whenLastStart + '.\n');
});

app.get('/time', function(req,res){
  res.setHeader('Content-Type', 'text/plain');
  var time = new Date ();
  res.end(time.toString());
});

//error handler
app.use(function (err, req, res, next){
  console.log(err.stack);
  res.status(400).send(err.message);
});

app.listen(hellobotPrefs.myPort, function(){
  var now = new Date ();
  hellobotStats.whenLastStart = now;
  console.log('hellobot listening on port: ' + hellobotPrefs.myPort);
});
