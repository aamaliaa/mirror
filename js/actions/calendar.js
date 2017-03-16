import utils from '../utils'

export const REQUEST_CALENDAR = 'REQUEST_CALENDAR'
export const RECEIVE_CALENDAR = 'RECEIVE_CALENDAR'
export const ERROR_CALENDAR = 'ERROR_CALENDAR'

export function requestCalendar() {
  return { type: REQUEST_CALENDAR }
}

export function receiveCalendar(calendar) {
  return { type: RECEIVE_CALENDAR, calendar }
}

export function errorCalendar(error) {
  return { type: ERROR_CALENDAR, error }
}

export function fetchCalendar() {
  return (dispatch, getState) => {
    dispatch(requestCalendar())
    return utils.getCalendar()
      .then(res => res.json())
      .then(json => dispatch(receiveCalendar(json)))
      .catch(err => dispatch(errorCalendar(err)))
  }
}
