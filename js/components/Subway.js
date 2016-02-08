var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var config = require('../config').subway

var SubwayActions = require('../actions/SubwayActions');
var SubwayStore = require('../stores/SubwayStore');

var Subway = React.createClass({

  getInitialState: function() {
    return SubwayStore.getState();
  },

  componentDidMount: function() {
    SubwayActions.getTimes();
    SubwayStore.listen(this.onChange);

    this._interval = setInterval(function() {
      SubwayActions.getTimes();
    }, config.delay);
  },

  componentWillUnmount: function() {
    SubwayStore.unlisten(this.onChange);
    clearInterval(this._interval);
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
    var msg = 'Leave ';
    var schedule = this.state.times.schedule[config.stationId][direction].slice(0, 5);
    var timeToWalk = config.timeToWalk;
    var leave;

    var times = schedule.map(function (t) {
      var arrivalFromNow = self.formatTime(t.arrivalTime);
      var timeToLeave = arrivalFromNow.numMin - timeToWalk;

      if (arrivalFromNow.numMin && timeToLeave >= 0 && !leave) {
        leave = {
          msg: msg + ( (timeToLeave === 0) ?
            'now' :
            ('within ' + timeToLeave + ' minute' + (timeToLeave > 1 ? 's' : '') ) ),
          routeId: t.routeId
        };
      }
      return {
        routeId: t.routeId,
        arrivalTime: t.arrivalTime,
        arrivalFromNow: arrivalFromNow
      };
    });

    return {
      leave: leave,
      times: times
    };
  },

  renderSubway: function(routeId) {
    return (
      <div className={'subway subway-' + routeId}>{routeId}</div>
    );
  },

  // renderTimes: function(schedule) {
  //   var arrivalTime, leaveTime;
  //   var now = (new Date()).getTime() / 1000;
  //
  //   return (
  //     <ul className='times'>
  //       {schedule.times.map(function (s) {
  //         if (now > s.arrivalTime) {
  //           return;
  //         }
  //
  //         return (
  //           <li key={s.arrivalTime} className={'route-' + s.routeId}>
  //             {this.renderSubway(s.routeId)}
  //             <div className="arrival-time">{s.arrivalFromNow.str}</div>
  //           </li>
  //         );
  //       }.bind(this))}
  //     </ul>
  //   );
  // },

  render: function() {
    console.log('subway render');
    if (_.isEmpty(this.state.times)) {
      return <div>{this.state.error || ''}</div>;
    }

    var schedule = this.getTimes(config.direction);

    return (
      <div>
        <div id="subway">
          <div className="message">
            {this.renderSubway(schedule.leave.routeId)}
            <div className="text">{schedule.leave.msg}</div>
          </div>
        </div>
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
