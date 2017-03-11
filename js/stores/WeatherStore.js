var alt = require('../alt');
var WeatherActions = require('../actions/WeatherActions');

var WeatherStore = alt.createStore({

  displayName: 'WeatherStore',

  bindListeners: {
    updateWeather: WeatherActions.UPDATE_WEATHER,
    errorWeather: WeatherActions.ERROR_WEATHER,
  },

  state: {
    weather: {},
    error: null
  },

  updateWeather: function(data) {
    this.setState({
      weather: data,
      error: null
    });
  },

  errorWeather: function(err) {
    this.setState({
      error: err
    });
  }

});

module.exports = WeatherStore;
