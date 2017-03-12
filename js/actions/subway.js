import utils from '../utils'

export const REQUEST_SUBWAY_TIMES = 'REQUEST_SUBWAY_TIMES'
export const RECEIVE_SUBWAY_TIMES = 'RECEIVE_SUBWAY_TIMES'
export const ERROR_SUBWAY_TIMES = 'ERROR_SUBWAY_TIMES'

export function requestSubwayTimes() {
  return { type: REQUEST_SUBWAY_TIMES }
}

export function receiveSubwayTimes(times) {
  return { type: RECEIVE_SUBWAY_TIMES, times }
}

export function errorSubwayTimes(error) {
  return { type: ERROR_SUBWAY_TIMES, error }
}

export function fetchSubwayTimes() {
  return (dispatch, getState) => {
    dispatch(requestSubwayTimes())
    return utils.getSubwayTimes()
      .then(res => res.json())
      .then(json => dispatch(receiveSubwayTimes(json)))
      .catch(err => dispatch(errorSubwayTimes(err)))
  }
}
