var React = require('react');
var moment = require('moment');

var Clock = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.date.getMinutes() !== this.props.date.getMinutes();
  },

  render: function() {
    console.log('clock render');

    var d = this.props.date;
    var m = moment(d);
    return(
      <div id="clock">
        <div className="container">
          <div className="time">{m.format('h:mm')}</div>
          <div className="day">{m.format('dddd')}</div>
          <div className="date">{m.format('MMMM Do')}</div>
        </div>
        <div className="clearfix" />
      </div>
    )
  }

});

module.exports = Clock;
