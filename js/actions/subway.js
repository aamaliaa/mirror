import utils from '../utils'
import { subway as config } from '../config'

export const REQUEST_SUBWAY_TIMES = 'REQUEST_SUBWAY_TIMES'
export const RECEIVE_SUBWAY_TIMES = 'RECEIVE_SUBWAY_TIMES'
export const ERROR_SUBWAY_TIMES = 'ERROR_SUBWAY_TIMES'

export function requestSubwayTimes(feedId, stationId) {
  return { type: REQUEST_SUBWAY_TIMES, feedId, stationId }
}

export function receiveSubwayTimes(feedId, stationId, times) {
  return { type: RECEIVE_SUBWAY_TIMES, feedId, stationId, times }
}

export function errorSubwayTimes(error) {
  return { type: ERROR_SUBWAY_TIMES, error }
}

export function fetchSubwayTimes() {
  return (dispatch, getState) => {
    config.stops.forEach(s => {
      dispatch(requestSubwayTimes(s.feedId, s.stationId))
      return utils.getSubwayTimes(s.feedId, s.stationId)
        .then(res => res.json())
        .then(json => dispatch(receiveSubwayTimes(s.feedId, s.stationId, json)))
        .catch(err => dispatch(errorSubwayTimes(err)))
    })
  }
}
