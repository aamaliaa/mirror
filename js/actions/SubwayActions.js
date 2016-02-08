var alt = require('../alt');
var fetch = require('node-fetch');
var stationId = require('../config').subway.stationId;
var host = require('../config').host;

var subwayActions = alt.createActions({

  getTimes: function() {
    var self = this;
    console.log('subway actions get()')
    return function(dispatch) {
      fetch(host + '/schedule/' + stationId)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        self.updateTimes(data);
      })
      .catch(function (err) {
        self.errorTimes(err);
      });
    }
  },

  updateTimes: function(times) {
    return times;
  },

  errorTimes: function(err) {
    return err;
  }

});

module.exports = subwayActions;
