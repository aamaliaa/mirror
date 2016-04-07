var React = require('react');
var mouseTrap = require('react-mousetrap').mouseTrap;

var Clock = require('./Clock');
var Weather = require('./Weather');
var Subway = require('./Subway');
var Status = require('./Status');
var Calendar = require('./Calendar');
var Chores = require('./Chores');

var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');

var utils = require('../utils');

var App = React.createClass({

  getInitialState: function() {
    return {
      app: AppStore.getState(),
      date: new Date(),
      mainContent: ''
    };
  },

  componentWillMount: function() {
    this.props.bindShortcut('down', this.showIP);
  },

  componentDidMount: function() {
    AppStore.listen(this.onChange);

    // version polling
    setInterval(function() {
      AppActions.getVersion();
    }, 60000); // 1 min

    // clock
    setInterval(function() {
      this.setState({
        date: new Date()
      });
    }.bind(this), 1000);
  },

  componentWillUnmount: function() {
    AppStore.unlisten(this.onChange);
    this.props.unbindShortcut('down');
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // new render only if minute updates (since we're not displaying seconds)
    // or main content has changed
    return (
      (nextState.date.getMinutes() !== this.state.date.getMinutes()) ||
      (nextState.mainContent !== this.state.mainContent)
    );
  },

  onChange: function(state) {
    this.setState({ app: state });
  },

  showIP: function() {
    var self = this;
    utils.getLocalIP().then(function(ip) {
      self.showContent(ip);
    });
  },

  showContent: function(mainContent) {
    var self = this;
    this.setState({ mainContent });
    setTimeout(function() {
      self.setState({ mainContent: '' });
    }, 10000);
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
        <div id="main">
          {this.state.mainContent}
        </div>
      </div>
    );
  }
});

module.exports = mouseTrap(App);
