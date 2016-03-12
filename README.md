# dash

Create a `config.js` in the root directory by copying over the contents of `config.template.js` and updating the file with your own API keys and data.

### Forecast.io API

Register for a forecast.io API key [here](https://developer.forecast.io/). The calls to the forecast.io API are cached every 15 min to prevent $$$... also do you really think the weather is going to change much over 15 minutes?

### MTA API

Register for an MTA API key [here](http://datamine.mta.info/user/register). Individual stop ids can be found via the New York City Transit Subway GTFS schedule data zip file that can be found [here](http://web.mta.info/developers/developer-data-terms.html#data).

### Google Calendar API

In order to get the correct auth credentials, follow the [Google Calendar API Quickstart tutorial](https://developers.google.com/google-apps/calendar/quickstart/nodejs). Save the resulting `client_secret.json` (googleCalSecretPath) and `calendar-nodejs-quickstart.json` (googleCalTokenPath) files to the app directory and specify their paths in `config.js` in order to use the Google Calendar integration.
