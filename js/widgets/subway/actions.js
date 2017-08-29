import _ from 'underscore'
import utils from '../../utils'
import { subway as config, api } from '../../../config'
import Mta from 'mta-gtfs'

const mta = new Mta({
  key: api.mtaKey,
})

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
    config.stops.forEach(({ feedId, stationId }) => {
      dispatch(requestSubwayTimes(feedId, stationId))
      return mta.schedule(stationId, feedId)
      .then(data => {
        if (_.isEmpty(data)) return
        dispatch(receiveSubwayTimes(feedId, stationId, data))
      })
      .catch(err => dispatch(errorSubwayTimes(err)))
    })
  }
}
