var alt = require('../alt');
var AppActions = require('../actions/AppActions');

var AppStore = alt.createStore({

  displayName: 'AppStore',

  bindListeners: {
    updateLastUpdated: AppActions.UPDATE_LAST_UPDATED,
    appError: AppActions.APP_ERROR
  },

  state: {
    lastUpdated: null,
    error: null
  },

  updateLastUpdated: function(lastUpdated) {
    var error = null;
    if (this.state.lastUpdated && new Date(this.state.lastUpdated) < new Date(lastUpdated)) {
      window.location.reload();
    }
    this.setState({ lastUpdated, error });
  },

  appError: function(error) {
    this.setState({error});
  }

});

module.exports = AppStore;
