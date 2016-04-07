var alt = require('../alt');
var fetch = require('node-fetch');
var host = require('../../config').host;

var appActions = alt.createActions({

  getLastUpdated: function() {
    var self = this;
    console.log('app lastUpdated actions get()');
    return function(dispatch) {
      fetch(host + '/lastUpdated')
      .then(function(res) {
        return res.json();
      })
      .then(function(data){
        self.updateLastUpdated(data.lastUpdated);
      })
      .catch(function(err) {
        self.appError(err);
      });
    }
  },

  updateLastUpdated: function(lastUpdated) {
    return lastUpdated;
  },

  appError: function(err) {
    return err;
  }

});

module.exports = appActions;
