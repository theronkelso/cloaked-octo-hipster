var firebase = require('firebase');

var USERS_LOCATION = 'https://amber-inferno-3633.firebaseio.com/users';

//hellobot.js

// Example data from slack
// token=SnyOVGyaIcAC7AWDs3uquhdb
// team_id=T0001
// channel_id=C2147483705
// channel_name=test
// timestamp=1355517523.000005
// user_id=U2147483697
// user_name=Steve
// text=googlebot: What is the air-speed velocity of an unladen swallow?
// trigger_word=googlebot:

function userCreated(userName, success){
  if (!success){
    console.log('user ' + userName + ' already exists!');
  } else {
    console.log('Successfully created ' + userName);
  }
}

function tryCreateUser(userName, userData){
  var usersRef = new firebase(USERS_LOCATION);

  usersRef.child(userName).transaction(function(currentUserData){
    console.log('in try');
    if (currentUserData === null){

      return userData;
    }
  }, function(error, commited) {
    userCreated(userName, commited);
  });
}

module.exports = function (req, res, next){
  var userName = req.body.user_name;
  var userData = { name : req.body.user_name };

  tryCreateUser(userName, userData);

  var botPayload = {
    text : 'Hello, ' + userName + '!'
  };

  //avoid and ininite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
};
