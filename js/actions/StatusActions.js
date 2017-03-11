import alt from '../alt'
import utils from '../utils'

var statusActions = alt.createActions({

  get: function() {
    var self = this;
    return function(dispatch) {
      utils.getSubwayStatus()
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
