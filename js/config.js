var _ = require('underscore');
var config = require('../config');

module.exports = _.omit(config, 'api');
