var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var fetch = require('node-fetch');
var Mta = require('mta-gtfs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Forecast = require('forecast');
var moment = require('moment');

var config = require('./config');

var mtaKey = config.api.mtaKey;
var forecastKey = config.api.forecastKey;
var weather = config.weather;
var googleCalSecretPath = config.api.googleCalSecretPath;
var googleCalTokenPath = config.api.googleCalTokenPath;
var googleCalScopes = ['https://www.googleapis.com/auth/calendar.readonly'];

var forecast = new Forecast({
	service: 'forecast.io',
	key: forecastKey,
	units: 'fahrenheit',
	cache: true,
	ttl: {
		minutes: 15,
		seconds: 0
	}
});

var mta = new Mta({
  key: mtaKey
});

app.use(express.static(path.join(__dirname, './public')));
app.use('/icons', express.static(path.join(__dirname, './icons')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/lastUpdated', function(req, res) {
	fs.stat(__dirname + '/public/js/main.js', function(err, stats) {
		res.json({ lastUpdated: stats.ctime });
	})
});

app.get('/schedule/:id', function (req, res) {
  var id = parseInt(req.params.id, 10);
  mta.schedule(id)
  .then(function (result) {
    res.json(result);
  });
});

app.get('/status/:type', function (req, res) {
  mta.status(req.params.type)
  .then(function (result) {
    res.json(result);
  });
});

app.get('/weather', function (req, res) {
  forecast.get([weather.latitude, weather.longitude], function (err, weather) {
    if (err) return console.dir(err);
    res.json(weather);
  });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(googleCalTokenPath, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

app.get('/calendar', function (req, res) {
    // Load client secrets from a local file.
  fs.readFile(googleCalSecretPath, function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(JSON.parse(content), function(auth) {
      var calendar = google.calendar('v3');
			var now = moment();
      calendar.events.list({
        auth: auth,
        calendarId: 'primary',
        timeMin: now.utc().format(),
        timeMax: now.add(1, 'days').utc().format(),
        singleEvents: true,
        orderBy: 'startTime'
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        res.json(response.items);
      });
    });
  });
});

var server = app.listen(3005, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});
