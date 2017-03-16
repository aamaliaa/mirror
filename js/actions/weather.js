import utils from '../utils'

export const REQUEST_WEATHER = 'REQUEST_WEATHER'
export const RECEIVE_WEATHER = 'RECEIVE_WEATHER'
export const ERROR_WEATHER = 'ERROR_WEATHER'

export function requestWeather() {
  return { type: REQUEST_WEATHER }
}

export function receiveWeather(weather) {
  return { type: RECEIVE_WEATHER, weather }
}

export function errorWeather(error) {
  return { type: ERROR_WEATHER, error }
}

export function fetchWeather() {
  return dispatch => {
    dispatch(requestWeather())
    return utils.getWeather()
      .then(res => res.json())
      .then(json => dispatch(receiveWeather(json)))
      .catch(err => dispatch(errorWeather(err)))
  }
}
