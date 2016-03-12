var React = require('react');

var Clock = require('./Clock');
var Weather = require('./Weather');
var Subway = require('./Subway');
var Status = require('./Status');
var Calendar = require('./Calendar');
var Chores = require('./Chores');

var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');

var App = React.createClass({

  getInitialState: function() {
    return {
      app: AppStore.getState(),
      date: new Date()
    };
  },

  componentDidMount: function() {
    AppStore.listen(this.onChange);

    // version polling
    setInterval(function() {
      AppActions.getVersion();
    }, 30000); // 30 secs

    // clock
    setInterval(function() {
      this.setState({
        date: new Date()
      });
    }.bind(this), 1000);
  },

  componentWillUnmount: function() {
    AppStore.unlisten(this.onChange);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // new render only if minute updates (since we're not displaying seconds)
    return nextState.date.getMinutes() !== this.state.date.getMinutes();
  },

  onChange: function(state) {
    this.setState({
      app: state
    });
  },

  render: function() {
    console.log('----------------app render', this.state.date.getMinutes(), '------------------');
    var error = null;

    if (this.state.app.error) {
      error = (
        <div id="error">
          <i className="fa fa-exclamation-triangle" />
          CONNECTION ERROR
        </div>
      );
    }
    return (
      <div>
        <div className="left">
          <Weather />
          <Calendar />
        </div>
        <div className="right">
          <Clock date={this.state.date} />
          <Subway />
          <Chores date={this.state.date} />
        </div>
        {error}
      </div>
    );
  }
});

module.exports = App;
