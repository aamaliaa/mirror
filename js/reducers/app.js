import {
  SET_APP_LAST_UPDATED,
  SET_APP_ERROR
} from '../actions/app'

function app(state = {
  lastUpdated: null,
  error: null
}, action) {
  switch (action.type) {
    case SET_APP_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case SET_APP_LAST_UPDATED:
      return {
        ...state,
        lastUpdated: action.lastUpdated,
      }
    default:
      return state
  }
}

export default app
