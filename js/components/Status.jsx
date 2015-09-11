var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var statusFilter = require('../config').status.regexFilter;

var StatusActions = require('../actions/StatusActions');
var StatusStore = require('../stores/StatusStore');

var Status = React.createClass({

  getInitialState: function() {
    return StatusStore.getState();
  },

  componentDidMount: function() {
    StatusActions.get();
    StatusStore.listen(this.onChange);
  },

  componentWillUnmount: function() {
    StatusStore.unlisten(this.onChange);
  },

  onChange: function (state) {
    this.setState(state);
  },

  render: function() {
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
    var status = _.find(this.state.status, function (s) {
      return statusFilter.test(s.name) && s.status !== 'GOOD SERVICE';
    });

    if (!status) {
      return false;
    }

    var text = status.text.replace(/<(br)\/?>/gi, '');

    return (
      <div
        className="status"
        dangerouslySetInnerHTML={{__html: text}}></div>
    );
  }

});

module.exports = Status;
