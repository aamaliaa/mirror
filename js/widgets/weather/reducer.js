import {
  RECEIVE_WEATHER,
  ERROR_WEATHER,
} from './actions'

function weather(state = {
  weather: {},
  error: null
}, action) {
  switch (action.type) {
    case ERROR_WEATHER:
      return {
        ...state,
        error: action.error,
      }
    case RECEIVE_WEATHER:
      return {
        ...state,
        weather: action.weather,
        error: null,
      }
    default:
      return state
  }
}

export default weather
