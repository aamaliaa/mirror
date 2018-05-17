import {
  RECEIVE_WEATHER,
  ERROR_WEATHER,
  COMMAND_ACTIVE_WEATHER,
  COMMAND_INACTIVE_WEATHER,
} from './actions'

function weather(state = {
  weather: {},
  isActive: false,
  error: null
}, action) {
  switch (action.type) {
    case COMMAND_ACTIVE_WEATHER:
      return {
        ...state,
        isActive: true,
      }
    case COMMAND_INACTIVE_WEATHER:
      return {
        ...state,
        isActive: false,
      }
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
