import alt from '../alt'
import utils from '../utils'

var calendarActions = alt.createActions({

  get: function() {
    var self = this;
    console.log('calendar actions get()')
    return function(dispatch) {
      utils.getCalendar()
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
