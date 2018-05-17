import _ from 'underscore'
import {
  RECEIVE_CITIBIKE_STATION,
  ERROR_CITIBIKE_STATION,
} from './actions'
import { citibike as config } from '../../../config'

function citibike(state = {
  error: null,
}, action) {
  switch (action.type) {
    case RECEIVE_CITIBIKE_STATION:
      const stationConfig = _.find(config.stations, (s) => s.id === action.stationId)
      const station_name = stationConfig.name
      return {
        ...state,
        [action.stationId]: { ...action.station, station_name },
        error: null,
      }
    case ERROR_CITIBIKE_STATION:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}

export default citibike
