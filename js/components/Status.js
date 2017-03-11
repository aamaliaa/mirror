var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var config = require('../config').status;

var StatusActions = require('../actions/StatusActions');
var StatusStore = require('../stores/StatusStore');

var Status = React.createClass({

  getInitialState: function() {
    return StatusStore.getState();
  },

  componentDidMount: function() {
    StatusActions.get();
    StatusStore.listen(this.onChange);

    this._interval = setInterval(function() {
      StatusActions.get();
    }, config.delay);
  },

  componentWillUnmount: function() {
    StatusStore.unlisten(this.onChange);
    clearInterval(this._interval);
  },

  onChange: function (state) {
    this.setState(state);
  },

  render: function() {
    console.log('status render');

    var status = this.parseStatus();

    if (!status) {
      return <div>{''}</div>;
    }

    return (
      <div>
        <h3>Service Changes</h3>
        {status}
      </div>
    );
  },

  parseStatus: function () {
    var s = this.state.status
    console.log(s)
    var filters = config.regexFilters;
    var status = '';
    for (var i=0; i<s.length; i++) {
      for (var j=0; j<filters.length; j++) {
        if (filters[j].test(s[i].name) && s[i].status !== 'GOOD SERVICE') {
          status += s[i].text;
        }
      }
    }

    if (status === '') {
      return false;
    }

    var text = status
      .replace(/<(br)\/?>/gi, '')
      .replace(/\[(.*?)\]/g, function(match) {
        var route = match.match(/\[(.+?)\]/)[1];
        return '<div class="subway subway-' + route + '">' + route + '</div>';
      });

    return (
      <div
        className="status"
        dangerouslySetInnerHTML={{__html: text}}></div>
    );
  }

});

module.exports = Status;
