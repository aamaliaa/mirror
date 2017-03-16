import {
  RECEIVE_SUBWAY_STATUS,
  ERROR_SUBWAY_STATUS,
} from '../actions/status'

function status(state = {
  status: {},
  error: null
}, action) {
  switch (action.type) {
    case RECEIVE_SUBWAY_STATUS:
      return {
        ...state,
        status: action.status,
        error: null,
      }
    case ERROR_SUBWAY_STATUS:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}

export default status
