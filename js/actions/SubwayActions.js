var alt = require('../alt');
var request = require('superagent');
var stationId = require('../config').subway.stationId;

var subwayActions = alt.createActions({

  getTimes: function() {
    var self = this;
    request
      .get('/schedule/' + stationId)
      .end(function (err, res) {
        if (err || !res) {
          self.actions.errorTimes(err);
        }
        self.dispatch(res.body);
      });
  },

  errorTimes: function(err) {
    this.dispatch(err);
  }

});

module.exports = subwayActions;
