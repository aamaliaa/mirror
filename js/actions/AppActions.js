var alt = require('../alt');
var fetch = require('node-fetch');
var host = require('../../config').host;

var appActions = alt.createActions({

  getVersion: function() {
    var self = this;
    console.log('app version actions get()')
    return function(dispatch) {
      fetch(host + '/version')
      .then(function(res) {
        return res.json();
      })
      .then(function(data){
        self.updateVersion(data.version);
      })
      .catch(function(err) {
        self.appError(err);
      });
    }
  },

  updateVersion: function(version) {
    return version;
  },

  appError: function(err) {
    return err;
  }

});

module.exports = appActions;
