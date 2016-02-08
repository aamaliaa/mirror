var alt = require('../alt');
var StatusActions = require('../actions/StatusActions');

var StatusStore = alt.createStore({

  displayName: 'StatusStore',

  bindListeners: {
    updateStatus: StatusActions.UPDATE_STATUS,
  },

  state: {
    status: {},
    error: null
  },

  updateStatus: function (data) {
    this.setState({
      status: data,
      error: null
    });
  },

  errorTimes: function (err) {
    this.setState({
      error: err
    });
  }

});

module.exports = StatusStore;
