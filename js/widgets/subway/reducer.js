import {
  REQUEST_SUBWAY_TIMES,
  RECEIVE_SUBWAY_TIMES,
  ERROR_SUBWAY_TIMES,
} from './actions'

function subway(state = {
  error: null,
}, action) {
  switch (action.type) {
    case RECEIVE_SUBWAY_TIMES:
      return {
        ...state,
        [`${action.feedId}_${action.stationId}`]: action.times.schedule[action.stationId],
        error: null,
      }
    case ERROR_SUBWAY_TIMES:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}

export default subway
