require('dotenv').config();

const SpotifyWebApi = require('spotify-web-api-node');
const EXPIRE_TIME = 3600000; // 3600 seconds = 1hr

function setAccessToken(spotifyHandler) {
    spotifyHandler.clientCredentialsGrant().then(
        function(data) {
            spotifyHandler.setAccessToken(data.body['access_token']);
            console.log('Current Spotify Access Token: ', data.body['access_token']);
        },
        function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        }
    );
}

function parseSpotifyURL(url) {
    const spotifyURL = 'https://open.spotify.com/playlist/';
    let spotifyInfo = url.replace(spotifyURL, '');
    querySeperatorIndex = spotifyInfo.indexOf('?');
    return spotifyInfo.substring(0,querySeperatorIndex);
}

let spotifyHandler = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_TOKEN,
    clientSecret: process.env.SPOTIFY_SECRET_TOKEN, 
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

setAccessToken(spotifyHandler);
let timer = setInterval(setAccessToken, EXPIRE_TIME,  spotifyHandler);

module.exports = {spotifyHandler, parseSpotifyURL};