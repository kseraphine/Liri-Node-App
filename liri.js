var request = require('request');
var fs = require('fs');
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
var params = {screen_name: 'kseraphine', count: 20};
var song = '';
var movie = '';

//my-tweets
var myTweets = function() {
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log('\nMy Tweets:\n');
      for (var i = 0; i < tweets.length; i++) {
      console.log('On,', tweets[i].created_at, tweets[i].user.name, 'said: ');
      console.log(tweets[i].text, '\n');
      }
    }else {
      console.log(error);
    }

    liriGo();
  });
};

//spotify-this-song
var spotifySearch = function() {
  spotify.search({ type: 'track', query: song }, function(err, data) {
      if(err) {
        console.log('Error occurred: ' + err);
        return;
      }else {
        console.log('\nSong Info:\n');
        console.log('Album: ', data.tracks.items[0].album.name);
        console.log('Artist: ', data.tracks.items[0].artists[0].name);
        console.log('Song: ', data.tracks.items[0].name);
        console.log('Preview: ', data.tracks.items[0].preview_url, '\n');
      }

      liriGo();
  });
};

//movie-this
var movieSearch = function(movie) {
  request('http://www.omdbapi.com/?t=' + movie, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var list = JSON.parse(body);

      console.log('\nMovie Info:\n');
      console.log('Title:', list.Title);
      console.log('Year:', list.Year);
      console.log('IMDB Rating:', list.imdbRating);
      console.log('Country:', list.Country);
      console.log('Language:', list.Language);
      console.log('Plot:', list.Plot);
      console.log('Actors:', list.Actors, '\n');
    }else if (error) {
      console.log('Movie search error: ' + error);
    }

    liriGo();
  });
};

//do-what-it-says
var doIt = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var fix = data.split('"');
    song = fix[1];
    spotifySearch();
  });
};

var firstPromt = {
  type: 'list',
  name: 'name',
  message: 'What would you like to do?',
  choices: [
    'my-tweets',
    'spotify-this-song',
    'movie-this',
    'do-what-it-says',
    'EXIT',
  ],
};

var spotifyPrompt = {
  type: 'input',
  name: 'song',
  message: 'What song and artist do you want to search?',
  default: function() {
    return 'Ace of Base The Sign';
  },
};

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
    switch (answers.name) {
      case 'my-tweets':
        console.log('Getting tweets...');
        myTweets();
        break;
      case 'spotify-this-song':
        inquirer.prompt(spotifyPrompt).then(function (answer1) {
          console.log('Searching song...');
          song = answer1.song;
          spotifySearch();
        });
        break;
      case 'movie-this':
        inquirer.prompt(moviePrompt).then(function (answer2) {
          console.log('Searching movie...', answer2.movie);
          movie = answer2.movie;
          movieSearch(movie);
        });
        break;
      case 'do-what-it-says':
        console.log('Ok, I\'ll try...');
        doIt();
        break;
      case 'EXIT':
        console.log('Goodbye!');
        break;
      default:
        console.log('Something went wrong...');
    }
  });
};

liriGo();
