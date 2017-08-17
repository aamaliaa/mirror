import utils from '../utils'
import Mta from 'mta-gtfs'

const mta = new Mta()

export const REQUEST_SUBWAY_STATUS = 'REQUEST_SUBWAY_STATUS'
export const RECEIVE_SUBWAY_STATUS = 'RECEIVE_SUBWAY_STATUS'
export const ERROR_SUBWAY_STATUS = 'ERROR_SUBWAY_STATUS'

export function requestSubwayStatus() {
  return { type: REQUEST_SUBWAY_STATUS }
}

export function receiveSubwayStatus(status) {
  return { type: RECEIVE_SUBWAY_STATUS, status }
}

export function errorSubwayStatus(error) {
  return { type: ERROR_SUBWAY_STATUS, error }
}

export function fetchSubwayStatus() {
  return (dispatch, getState) => {
    dispatch(requestSubwayStatus())
    return mta.status('subway')
      .then(data => dispatch(receiveSubwayStatus(data)))
      .catch(err => dispatch(errorSubwayStatus(err)))
  }
}
