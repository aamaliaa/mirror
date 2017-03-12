import _ from 'underscore'
import config from '../config'

module.exports = _.omit(config, 'api');
