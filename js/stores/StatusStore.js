var alt = require('../alt');
var StatusActions = require('../actions/StatusActions');

var StatusStore = alt.createStore({

  displayName: 'StatusStore',

  bindListeners: {
    getStatus: StatusActions.get,
  },

  state: {
    status: {},
    error: null
  },

  getStatus: function (data) {
    this.setState({
      status: data,
      error: null
    });

    setTimeout(function() {
      StatusActions.get();
    }, 300000); // 5 min
  },

  errorTimes: function (err) {
    this.setState({
      error: err
    });
  }

});

module.exports = StatusStore;
