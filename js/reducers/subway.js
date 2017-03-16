import {
  REQUEST_SUBWAY_TIMES,
  RECEIVE_SUBWAY_TIMES,
  ERROR_SUBWAY_TIMES,
} from '../actions/subway'

function subway(state = {
  times: {},
  error: null,
}, action) {
  switch (action.type) {
    case RECEIVE_SUBWAY_TIMES:
      return {
        ...state,
        times: action.times,
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
