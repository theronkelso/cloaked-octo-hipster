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

function random (lower, upper) {
    var range = upper - lower + 1;
    return (Math.floor ((Math.random () * range) + lower));
}

function getRandomSnarkySlogan () { //8/15/14 by DW
    var snarkySlogans = [
    "Good for the environment.",
    "All baking done on premises.",
    "Still diggin!",
    "It's even worse than it appears.",
    "Ask not what the Internet can do for you...",
    "You should never argue with a crazy man.",
    "Welcome back my friends to the show that never ends.",
    "Greetings, citizen of Planet Earth. We are your overlords. :-)",
    "We don't need no stinkin rock stars.",
    "This aggression will not stand.",
    "Pay no attention to the man behind the curtain.",
    "Only steal from the best.",
    "Reallll soooon now...",
    "What a long strange trip it's been.",
    "Ask not what the Internet can do for you.",
    "When in doubt, blog.",
    "Shut up and eat your vegetables.",
    "Don't slam the door on the way out.",
    "Yeah well, that's just, you know, like, your opinion, man.",
    "So, it has come to this."
    ];
    return (snarkySlogans [random (0, snarkySlogans.length - 1)]);
}

module.exports = function (req, res, next){
  var userName = req.body.user_name;
  var userData = { name : req.body.user_name };

  tryCreateUser(userName, userData);
  var slogan = getRandomSnarkySlogan();
  var botPayload = {
    text : 'Hello, ' + userName + '... ' + slogan
  };

  //avoid and ininite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
};
