import alt from '../alt'
import utils from '../utils'

var appActions = alt.createActions({

  getLastUpdated: function() {
    var self = this;
    console.log('app lastUpdated actions get()');
    return function(dispatch) {
      return utils.getLastUpdated()
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
