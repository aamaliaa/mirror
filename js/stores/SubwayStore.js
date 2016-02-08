var alt = require('../alt');
var SubwayActions = require('../actions/SubwayActions');

var SubwayStore = alt.createStore({

  displayName: 'SubwayStore',

  bindListeners: {
    updateTimes: SubwayActions.UPDATE_TIMES,
    errorTimes: SubwayActions.ERROR_TIMES
  },

  state: {
    times: {},
    error: null
  },

  updateTimes: function (data) {
    this.setState({
      times: data,
      error: null
    });
  },

  errorTimes: function (err) {
    this.setState({
      error: err
    });
  }

});

module.exports = SubwayStore;
