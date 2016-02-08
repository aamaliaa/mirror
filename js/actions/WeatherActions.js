var alt = require('../alt');
var fetch = require('node-fetch');
var host = require('../../config').host;

var weatherActions = alt.createActions({

  get: function() {
    var self = this;
    console.log('weather actions get()')
    return function(dispatch) {
      fetch(host + '/weather')
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
    return err;
  }

});

module.exports = weatherActions;
