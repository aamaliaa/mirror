var alt = require('../alt');
var SubwayActions = require('../actions/SubwayActions');

var SubwayStore = alt.createStore({

  displayName: 'SubwayStore',

  bindListeners: {
    getTimes: SubwayActions.getTimes,
    errorTimes: SubwayActions.errorTimes
  },

  state: {
    times: {},
    error: null
  },

  getTimes: function (data) {
    this.setState({
      times: data,
      error: null
    });

    setTimeout(function() {
      SubwayActions.getTimes();
    }, 30000);
  },

  errorTimes: function (err) {
    this.setState({
      error: err
    });
  }

});

module.exports = SubwayStore;
