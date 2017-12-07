# mirror

### Development

Create a `config.js` in the root directory by copying over the contents of `config.template.js` and updating the file with your own API keys and data.

For development, run `npm run dev`.

To build and "deploy" the smart mirror app, `npm run build` and then `npm start` and navigate to http://localhost:3005.

### Installing on Raspberry Pi

For speech recognition...
```
sudo apt-get install libmagic-dev libatlas-base-dev
```

#### Forecast.io API

Register for a forecast.io API key [here](https://developer.forecast.io/). The calls to the forecast.io API are cached every 15 min to prevent $$$... also do you really think the weather is going to change much over 15 minutes?

#### MTA API

Register for an MTA API key [here](http://datamine.mta.info/user/register). Individual stop ids can be found via the New York City Transit Subway GTFS schedule data zip file that can be found [here](http://web.mta.info/developers/developer-data-terms.html#data).

#### Google Calendar API

In order to get the correct auth credentials, follow the [Google Calendar API Quickstart tutorial](https://developers.google.com/google-apps/calendar/quickstart/nodejs). Save the resulting `client_secret.json` (googleCalSecretPath) and `calendar-nodejs-quickstart.json` (googleCalTokenPath) files to the app directory and specify their paths in `config.js` in order to use the Google Calendar integration.

### Keyboard Shortcuts

* &uarr; - shows when the version of `main.js` the page is accessing was last built/changed
* &darr; - shows the machine's local IP address (useful for remote debugging)

### Dependencies

```
#sox install for sonus speech recognition
sudo apt-get install sox libatlas-base-dev
# ??
# apt-get install -y sox libsox-fmt-all alsa-utils libatlas-base-dev libatlas3gf-base
```

### Speech commands

TODO: use annyang for textual intent recognition or is there a better option?

##### Subway
* Mira, show me the schedule for the 2 and 3 trains.
* Mira, show me the A train.
* Mira, is the A train delayed?
* Mira, are there delays on the A train?
* Mira, when do I need to leave for the 2/3?
