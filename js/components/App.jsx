var React = require('react');

var Subway = require('./Subway');
var Status = require('./Status');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Subway />
        <Status />
      </div>
    );
  }
});

module.exports = App;
