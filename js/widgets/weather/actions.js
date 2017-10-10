import Forecast from 'forecast'
import utils from '../../utils'
import { weather as config, api } from '../../../config'

const API_KEY = api.forecastKey
const LATITUDE = config.latitude
const LONGITUDE = config.longitude

const forecast = new Forecast({
	service: 'forecast.io',
	key: API_KEY,
	units: 'fahrenheit',
	cache: true,
	ttl: {
		minutes: 15,
		seconds: 0
	},
});

export const REQUEST_WEATHER = 'REQUEST_WEATHER'
export const RECEIVE_WEATHER = 'RECEIVE_WEATHER'
export const ERROR_WEATHER = 'ERROR_WEATHER'
export const COMMAND_ACTIVE_WEATHER = 'COMMAND_ACTIVE_WEATHER'
export const COMMAND_INACTIVE_WEATHER = 'COMMAND_INACTIVE_WEATHER'

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
    return new Promise((resolve, reject) => {
      forecast.get([LATITUDE, LONGITUDE], (err, weather) => {
        if (err) return reject(err)
        resolve(weather)
      })
    })
    .then(data => dispatch(receiveWeather(data)))
    .catch(err => dispatch(errorWeather(err)))
  }
}
