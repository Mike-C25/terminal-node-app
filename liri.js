require('dotenv').config();
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');


var request = require('request');
var userCategory = process.argv[2];
var userArgs = process.argv.splice(3).join(" ");

if (userCategory && userArgs) {
    console.log(`\n Input: ${userCategory} ${userArgs} \n`);
}
checker();

function checker() {
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
            console.log(`\nPlease input one of the following: \n \n my-tweets \n spotify-this-song '<song name here>' \n movie-this '<movie name here>' \n do-what-it-says \n\n`);
    }
}


//OMDB AJAX CALL
function callMovie() {
    var movieName = userArgs ? userArgs : "Shawshank Redemption";
    if (!userArgs) {
        console.log(`\nMissing parameters detected, defaulting result to Shawshank Redemption... \n`);
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    var totalM = "";

    request(queryUrl, function(err, res, body) {
        if (err) {
            console.log(err, res);
        }
        if (!err && res.statusCode === 200) {
            var movieObj = JSON.parse(body);

            var rottenTomatoesRating;
            var ratings = movieObj.Ratings;
            for (rating in ratings) {
                if (ratings[rating].Source === "Rotten Tomatoes") {
                    rottenTomatoesRating = `Rotten Tomatoes Rating: ${ratings[rating].Value}`;
                }
            }
            totalM = `Movie Title: ${movieObj.Title}
Year Released: ${movieObj.Year}
IMDB Rating: ${movieObj.imdbRating}
${rottenTomatoesRating}
Location of Production: ${movieObj.Country}
Language: ${movieObj.Language}
Synopsis: ${movieObj.Plot}
Actors: ${movieObj.Actors}`

        }

        console.log(totalM);
        fAppend(userCategory, totalM);
    });
}


//TWITTER AJAX CALL
function callTwitter() {
    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    client.get('favorites/list', function(err, tweets, res) {
        if (err) {
            throw err;
        }
        var totalT = "";
        for (tweet in tweets) {
            var t = JSON.stringify(tweets[tweet], null, 4);
            console.log(` ${t} \n`);
            totalT += `${t} \n`
        }
        fAppend(userCategory, totalT)
    });
}




//SPOTIFY AJAX CALL
function callSpotify() {

    var spotify = new Spotify({
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET
    });
    var totalS = "";

    if (!userArgs) {
        console.log(`\nMissing parameters detected, defaulting Result to "The Sign" by Ace of Base... \n`);
    }

    spotify
        .search({ type: 'track', query: userArgs ? userArgs : "The Sign ace of base" })
        .then(function(res) {
            spotifyObj = res.tracks.items[0];
            // console.log(spotifyObj);
            var artists = spotifyObj.artists;
            var artistsList = [];
            for (artist in artists) {
                artistsList.push(artists[artist].name)
            }
            totalS = `Artist(s): ${artistsList.join(", ")}
Song Name: ${spotifyObj.name}
Preview the song here: ${spotifyObj.preview_url}
Album Name: ${spotifyObj.album.name}\n`;
          
            console.log(totalS);
            fAppend(userCategory, totalS)
        })
        .catch(function(err) {
            console.log(err);
        });
}

function callWhat() {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        if (err) throw err;
        // console.log(data);
        fileArray = data.split(",");
        // console.log(fileArray);
        userCategory = fileArray[0];
        userArgs = fileArray[1];
        checker();
    });
}


function fAppend(input, result) {
    // console.log(input);
    fs.appendFile('./log.txt', `\ncmd=${input}\n\n${result}\n`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log(`\nSuccessfully appended data to file.`)
    });
}