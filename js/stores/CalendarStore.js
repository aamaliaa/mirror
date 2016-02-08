var alt = require('../alt');
var CalendarActions = require('../actions/CalendarActions');

var CalendarStore = alt.createStore({

  displayName: 'CalendarStore',

  bindListeners: {
    updateCalendar: CalendarActions.UPDATE_CALENDAR
  },

  state: {
    calendar: {},
    error: null
  },

  updateCalendar: function(data) {
    this.setState({
      calendar: data,
      error: null
    });
  },

  errorCalendar: function(err) {
    this.setState({
      error: err
    });
  }

});

module.exports = CalendarStore;
