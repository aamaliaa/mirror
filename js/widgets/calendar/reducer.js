import {
  REQUEST_CALENDAR,
  RECEIVE_CALENDAR,
  ERROR_CALENDAR,
} from './actions'

function calendar(state = {
  calendar: {},
  error: null,
}, action) {
  switch (action.type) {
    case ERROR_CALENDAR:
      return {
        ...state,
        error: action.error,
      }
    case RECEIVE_CALENDAR:
      return {
        ...state,
        calendar: action.calendar,
        error: null,
      }
    default:
      return state
  }
}

export default calendar
