var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var stationId = require('../config').subway.stationId;

var SubwayActions = require('../actions/SubwayActions');
var SubwayStore = require('../stores/SubwayStore');

var Subway = React.createClass({

  getInitialState: function() {
    return SubwayStore.getState();
  },

  componentDidMount: function() {
    SubwayActions.getTimes();
    SubwayStore.listen(this.onChange);
  },

  componentWillUnmount: function() {
    SubwayStore.unlisten(this.onChange);
  },

  onChange: function (state) {
    this.setState(state);
  },

  /**
   * formats API output for display
   * @param  {string} direction (either 'N' or 'S')
   * @return {object}           schedule
   */
  getTimes: function(direction) {
    var self = this;
    var msg = 'You should leave ';
    var schedule = this.state.times.schedule[stationId][direction].slice(0, 5);
    var timeToWalk = 5; // it takes ~5 min to walk to the train
    var leave = [];
    var leaveMin;

    var times = schedule.map(function (t) {
      var arrivalFromNow = self.formatTime(t.arrivalTime);
      if (arrivalFromNow.numMin && arrivalFromNow.numMin - timeToWalk >= 0) {
        leave.push(arrivalFromNow.numMin - timeToWalk);
      }
      return {
        routeId: t.routeId,
        arrivalTime: t.arrivalTime,
        arrivalFromNow: arrivalFromNow
      };
    });

    leaveMin = _.min(leave);
    return {
      leave: msg + ( (leaveMin === 0) ?
        'now.' :
        ('within ' + leaveMin + ' minute' + (leaveMin > 1 ? 's.' : '.') ) ),
      times: times
    };
  },

  renderTimes: function(schedule) {
    var arrivalTime, leaveTime;
    var self = this;
    var now = (new Date()).getTime() / 1000;

    return (
      <div>
        <h3>{schedule.leave}</h3>
        <ul className='times'>
        {schedule.times.map(function (s) {
          if (now > s.arrivalTime) {
            return;
          }

          return (
            <li key={s.arrivalTime} className={'route-' + s.routeId}>
              <div className={'subway subway-' + s.routeId}>
                <span className="route-number">{s.routeId}</span>
              </div>
              <div className="arrival-time">{s.arrivalFromNow.str}</div>
            </li>
          );
        })}
        </ul>
      </div>
    );
  },

  render: function() {
    if (_.isEmpty(this.state.times)) {
      return <div>{this.state.error || ''}</div>;
    }

    return (
      <div>
        {this.renderTimes(this.getTimes('S'))}
      </div>
    );
  },

  formatTime: function(time) {
    var numMin = null;
    var time = moment(time, 'X').fromNow();
    var found = time.match(/^in ([0-9]+) minutes/);
    if (found && found[1]) {
      numMin = found[1];
    }

    return {
      str: time.replace('in ', '').replace('a minute', '1 minute'),
      numMin: numMin
    };
  }
});

module.exports = Subway;
