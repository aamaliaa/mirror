var alt = require('../alt');
var AppActions = require('../actions/AppActions');

var AppStore = alt.createStore({

  displayName: 'AppStore',

  bindListeners: {
    updateVersion: AppActions.UPDATE_VERSION,
    appError: AppActions.APP_ERROR
  },

  state: {
    version: null,
    error: null
  },

  updateVersion: function(version) {
    var error = null;
    if (this.state.version && this.state.version !== version) {
      window.location.reload();
    }
    this.setState({version, error});
  },

  appError: function(error) {
    this.setState({error});
  }

});

module.exports = AppStore;
