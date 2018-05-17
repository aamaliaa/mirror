# mirror

Smart mirror Electron app written with React/Redux to be run on Raspberry Pi.

## Development

Create a `config.js` in the root directory by copying over the contents of `config.template.js` and updating the file with your own API keys and data.

For speech recognition, install sox.
```
brew install sox
```

For development, run
```
yarn run dev
```

### Widgets

Each service is contained in its own widget. These can be found in the `js/widgets/` directory.

_TODO: document widget creation and infrastructure_

## Installing on Raspberry Pi

For speech recognition...
```
sudo apt-get install sox libmagic-dev libatlas-base-dev
```

Set up `~/.asoundrc` -> some info on that [here](https://raspberrypi.stackexchange.com/questions/38161/how-to-reorder-the-index-for-mic-on-new-raspbian-jessie-for-pocketsphinx/38163).


## Keyboard Shortcuts

* &uarr; - shows when the version of `main.js` the page is accessing was last built/changed
* &darr; - shows the machine's local IP address (useful for remote debugging)

## Speech commands

TODO: use annyang for textual intent recognition or is there a better option?

##### Subway
* Mira, show me the schedule for the 2 and 3 trains.
* Mira, show me the A train.
* Mira, is the A train delayed?
* Mira, are there delays on the A train?
* Mira, when do I need to leave for the 2/3?

##### Weather
* Mira, what is the weather?
* Mira, show me the weather.

## APIs

##### Forecast.io API

Register for a forecast.io API key [here](https://developer.forecast.io/). The calls to the forecast.io API are cached every 15 min to prevent $$$... also do you really think the weather is going to change much over 15 minutes?

##### MTA API

Register for an MTA API key [here](http://datamine.mta.info/user/register). Individual stop ids can be found via the New York City Transit Subway GTFS schedule data zip file that can be found [here](http://web.mta.info/developers/developer-data-terms.html#data).

##### Google Calendar API

In order to get the correct auth credentials, follow the [Google Calendar API Quickstart tutorial](https://developers.google.com/google-apps/calendar/quickstart/nodejs). Save the resulting `client_secret.json` (googleCalSecretPath) and `calendar-nodejs-quickstart.json` (googleCalTokenPath) files to the app directory and specify their paths in `config.js` in order to use the Google Calendar integration.
