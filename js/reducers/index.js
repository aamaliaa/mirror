import { combineReducers } from 'redux'

import app from './app'
import calendar from './calendar'
import status from './status'
import subway from './subway'
import weather from './weather'

export default combineReducers({
  app,
  calendar,
  status,
  subway,
  weather,
})
