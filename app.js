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

var myVersion = '0.03'; myProductName = 'hellobot';

var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./hellobot');
var firebase = require('firebase');

var hellobotPrefs = {
  myPort: process.env.PORT || 3000,
  firebaseUrl: 'https://amber-inferno-3633.firebaseio.com/users'
};

var fb = new firebase(hellobotPrefs.firebaseUrl);
var fnamePrefs = "prefs/prefs.json"; fname = 'perfs/stats.json';
var now = new Date ();

var app = express();

//body parser middleware
app.use(bodyParser.urlencoded({extended:true}));

//test route
app.get('/', function (req,res) {
  //  fb.child('name').once('value', function(snapshot){
  fb.once('value', function(snapshot){
    console.log(snapshot.val());
    res.status(200).send(snapshot.val());
    //res.end();
  }, function (errorObject){
    console.log('the read failed: ' + errorObject.code);
  });
});

app.post('/hello', hellobot);

app.get('/version', function(req,res){
  res.setHeader('Content-Type', 'text/plain');
  res.end('Version ' + myVersion + ' of ' + myProductName + '.\n');
});

app.get('/now', function(req,res){
  res.setHeader('Content-Type', 'text/plain');
  res.end(now.toString());
});

//error handler
app.use(function (err, req, res, next){
  console.log(err.stack);
  res.status(400).send(err.message);
});

app.listen(hellobotPrefs.myPort, function(){

  console.log('hellobot listening on port: ' + hellobotPrefs.myPort);
});
