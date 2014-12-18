//app.js
var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./hellobot');
var firebase = require('firebase');
var fb = new firebase('https://amber-inferno-3633.firebaseio.com/users');

var app = express();
var port = process.env.PORT || 3000;

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

//error handler
app.use(function (err, req, res, next){
  console.log(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function(){
  console.log('Slackbot listening on port ' + port);
})
