import alt from '../alt'
import utils from '../utils'

var subwayActions = alt.createActions({

  getTimes: function() {
    var self = this;
    console.log('subway actions get()')
    return function(dispatch) {
      utils.getSubwayTimes()
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        self.updateTimes(data);
      })
      .catch(function (err) {
        self.errorTimes(err);
      });
    }
  },

  updateTimes: function(times) {
    return times;
  },

  errorTimes: function(err) {
    return err;
  }

});

module.exports = subwayActions;
