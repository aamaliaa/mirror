import alt from '../alt'
import utils from '../utils'

var weatherActions = alt.createActions({

  get: function() {
    var self = this;
    console.log('weather actions get()')
    return function(dispatch) {
      utils.getWeather()
      .then(function(res) {
        return res.json();
      })
      .then(function (data) {
        self.updateWeather(data);
      })
      .catch(function (err) {
        self.errorWeather(err);
      });
    }
  },

  updateWeather: function(weather) {
    return weather;
  },

  errorWeather: function(err) {
    return err.message || err;
  }

});

module.exports = weatherActions;
