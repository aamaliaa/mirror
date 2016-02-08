var alt = require('../alt');
var fetch = require('node-fetch');
var host = require('../config').host;

var statusActions = alt.createActions({

  get: function() {
    var self = this;
    return function(dispatch) {
      fetch(host + '/status/subway')
      .then(function(res) {
        return res.json();
      })
      .then(function (data) {
        self.updateStatus(data);
      })
      .catch(function (err) {
        self.errorStatus(err);
      });
    }
  },

  updateStatus: function(status) {
    return status;
  },

  errorStatus: function(err) {
    return err;
  }

});

module.exports = statusActions;
