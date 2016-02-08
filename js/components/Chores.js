var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var config = require('../config').chores;

var Chores = React.createClass({

  propTypes: {
    date: React.PropTypes.object
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.date.getHours() !== this.props.date.getHours();
  },

  parseChores: function() {
    var today = moment(this.props.date).format('dddd').toLowerCase();
    var hour = this.props.date.getHours();
    return _.filter(config[today], function(chore) {
      if (chore.timeRange) {
        if (hour >= chore.timeRange[0] && hour <= chore.timeRange[1]) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
  },

  render: function() {
    var chores = this.parseChores();

    return (
      <div id="chores">
        {chores.map(function(c, i) {
          return (
            <div className="chore" key={i}>
              <i className={'fa fa-' + c.icon} />
              {c.text}
            </div>
          );
        })}
      </div>
    );
  }

});

module.exports = Chores;
