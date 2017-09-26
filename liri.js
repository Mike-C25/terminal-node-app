require('dotenv').config();

var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');


var request = require('request');
var userCategory = process.argv[2];
var userArgs = process.argv.split(3).join(" ");

console.log(userCategory, userArgs);


switch (userCategory) {
    case "my-tweets":
        callTwitter();
        break;
    case "spotify-this-song":
        callSpotify();
        break;
    case "movie-this":
        callMovie();
        break;
    case "do-what-it-says":
        callWhat();
        break;
    default:
        console.log(`Please input one of the following: /\n "my-tweets" /\n "spotify-this-song", /\n "movie-this", /\n "do-what-it-says"`);
}

//OMDB
function callMovie() {
    var movieName = "";

    movieName = name;

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(err, res, body) {
        if (err) {
            console.log(err, res);
        }
        if (!err && res.statusCode === 200) {
            console.log(body);
        }

        // console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
    });
}


//TWITTER
function callTwitter() {
    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    var tUrl = "";

    // client.get()
}




//SPOTIFY
function callSpotify() {
    var sUrl = "";

    var spotify = new Spotify({
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET
    });
}