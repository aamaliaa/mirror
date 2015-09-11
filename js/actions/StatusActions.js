var alt = require('../alt');
var request = require('superagent');

var statusActions = alt.createActions({

  get: function() {
    var self = this;
    request
      .get('/status/subway')
      .end(function (err, res) {
        if (err || !res) {
          self.actions.error(err);
        }
        self.dispatch(res.body);
      });
  },

  error: function(err) {
    this.dispatch(err);
  }

});

module.exports = statusActions;
