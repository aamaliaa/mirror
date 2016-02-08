var alt = require('../alt');
var fetch = require('node-fetch');
var host = require('../../config').host;

var calendarActions = alt.createActions({

  get: function() {
    var self = this;
    console.log('calendar actions get()')
    return function(dispatch) {
      fetch(host + '/calendar')
      .then(function(res) {
        return res.json();
      })
      .then(function (data) {
        self.updateCalendar(data);
      })
      .catch(function (err) {
        self.errorCalendar(err);
      });
    }
  },

  updateCalendar: function(calendar) {
    return calendar;
  },

  errorCalendar: function(err) {
    return err;
  }

});

module.exports = calendarActions;
