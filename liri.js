var request = require('request');
var inquirer = require('inquirer');
var Twitter = require('twitter');
var spotify = require('spotify');
var keys = require('./keys.js');
var myKeys = keys.twitterKeys;
var client = new Twitter({
  consumer_key: myKeys.consumer_key,
  consumer_secret: myKeys.consumer_secret,
  access_token_key: myKeys.access_token_key,
  access_token_secret: myKeys.access_token_secret,
});
var params = {screen_name: 'kseraphine'};
var song = '';
var movie = '';

//my-tweets
var myTweets = function() {
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
      console.log(response);
    }else {
      console.log(error);
    }

    // Do something with tweets.
  });
};

//spotify-this-song
var spotifySearch = function() {
  spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
      if( err ) {
          console.log('Error occurred: ' + err);
          return;
      }else {
        console.log(data);
      }

      // Do something with 'data'
  });
};

//movie-this
var movieSearch = function() {
  request('http://www.omdbapi.com/?t=' + movie, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }else if (error) {
      console.log('Movie search error: ' + error)
    }
  });
};
//do-what-it-says

var firstPromt = {
  type: 'list',
  name: 'name',
  message: 'What would you like to do?',
  choices: [
    'my-tweets',
    'spotify-this-song',
    'movie-this',
    'do-what-it-says',
  ],
  default: function() {
    return 'do-what-it-says';
  },
};

var spotifyPrompt = {
  type: 'input',
  name: 'song',
  message: 'What song do you want to search?',
  default: function() {
    return 'The Sign';
  },
};//, {
//  type: 'input',
//  name: 'artist',
//  message: 'Who is the artist?',
//  default: function() {
//    return 'Ace of Base';
//  }
//}

var moviePrompt = {
  type: 'input',
  name: 'movie',
  message: 'What movie do you want to search?',
  default: function() {
    return 'Mr. Nobody';
  },
};

var liriGo = function () {
  inquirer.prompt(firstPromt).then(function (answers) {
    switch (answers.firstPromt) {
      case 'my-tweets':
        console.log('Getting tweets...');
        myTweets();
        break;
      case 'spotify-this-song':
        inquirer.prompt(spotifyPrompt).then(function (answer1) {
          console.log('Searching song...');
          song = answer1;
          spotifySearch();
        });
        break;
      case 'movie-this':
        inquirer.prompt(moviePrompt).then(function (answer2) {
          console.log('Searching movie...');
          movie = answer2;
          movieSearch();
        });
        break;
      case 'do-what-it-says':
        console.log('Sorry, I have no idea how to do that.');
        break;
      default:
        console.log('Something went wrong...');
    }
    /*if(answers.firstPromt == 'my-tweets') {
      console.log('Getting tweets...');
      myTweets();
    }else if (answers.firstPromt == 'spotify-this-song') {
      inquirer.prompt(spotifyPrompt).then(function (answer1) {
        console.log('Searching song...');
        song = answer1;
        spotifySearch();
      });
    }else if (answers.firstPromt == 'movie-this') {
      inquirer.prompt(moviePrompt).then(function (answer2) {
        console.log('Searching movie...');
        movie = answer2;
        movieSearch();
      });
    }else if (answers.firstPromt == 'do-what-it-says') {
      console.log('Sorry, I have no idea how to do that.');
    }else {
      console.log('Sorry I didn\'t catch your answer.');
    }*/
  });
};

liriGo();
