import _ from 'underscore'
import { citibike as config } from '../../../config'

export const REQUEST_CITIBIKE_STATION = 'REQUEST_CITIBIKE_STATION'
export const RECEIVE_CITIBIKE_STATION = 'RECEIVE_CITIBIKE_STATION'
export const ERROR_CITIBIKE_STATION = 'ERROR_CITIBIKE_STATION'

export function requestCitibikeStation(stationId) {
  return { type: REQUEST_CITIBIKE_STATION, stationId }
}

export function receiveCitibikeStation(stationId, station) {
  return { type: RECEIVE_CITIBIKE_STATION, stationId, station }
}

export function errorCitibikeStation(error) {
  console.log(error)
  return { type: ERROR_CITIBIKE_STATION, error }
}

export function fetchCitibikeStation() {
  return (dispatch, getState) => {
    config.stations.forEach(({ id }) => {
      dispatch(requestCitibikeStation(id))
      return fetch('https://gbfs.citibikenyc.com/gbfs/en/station_status.json')
        .then(data => data.json())
        .then(data => {
          if (_.isEmpty(data)) return
          const stationData = _.find(data.data.stations, (s) => s.station_id === id.toString())
          dispatch(receiveCitibikeStation(id, stationData))
        })
        .catch(err => dispatch(errorCitibikeStation(err)))
    })
  }
}
