var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var config = require('../config').calendar;

var CalendarActions = require('../actions/CalendarActions');
var CalendarStore = require('../stores/CalendarStore');

var Calendar = React.createClass({

  getInitialState: function() {
    return CalendarStore.getState();
  },

  componentDidMount: function() {
    CalendarActions.get();
    CalendarStore.listen(this.onChange);
    this._interval = setInterval(function() {
      CalendarActions.get();
    }, config.delay);
  },

  componentWillUnmount: function() {
    CalendarStore.unlisten(this.onChange);
    clearInterval(this._interval);
  },

  onChange: function(state) {
    this.setState(state);
  },

  render: function() {
    if (_.isEmpty(this.state.calendar)) {
      return false;
    }

    return (
      <div id="calendar">
        <ul>
          {this.state.calendar.map(function (item) {
            var time = 'ALL DAY';

            if (item.start.dateTime && item.end.dateTime) {
              time = moment(item.start.dateTime).format('LT') + '-' + moment(item.end.dateTime).format('LT');
              time = time.replace(/(\s+|:00)/g, '');
            }

            return (
              <li key={item.id}>
                <i className="fa fa-calendar-o" />
                <span className="time">{time}</span>{item.summary}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

});

module.exports = Calendar;
